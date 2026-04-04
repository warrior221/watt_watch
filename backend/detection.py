from data_store import grid_data
from config import THRESHOLD, ALERT_EMAIL, ALERT_EMAIL_PASSWORD, ALERT_RECIPIENT
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_alert_email(recipient, pole_id, area, expected, actual, confidence_pct, severity, city="Uploaded Grid"):
    """
    Send a real SMTP email alert via Gmail.
    `recipient` is the logged-in user's email (from Supabase).
    Falls back to ALERT_RECIPIENT from .env if not provided.
    Skips gracefully when sender credentials are not configured.
    """
    # Resolve recipient: user email > env fallback > skip
    to_addr = recipient or ALERT_RECIPIENT
    if not to_addr:
        print(f"[EMAIL SKIPPED] No recipient available. Alert: Pole {pole_id} | {severity} | {confidence_pct}%")
        return
    if not ALERT_EMAIL or not ALERT_EMAIL_PASSWORD:
        print(f"[EMAIL SKIPPED] Sender credentials not configured. Would send to {to_addr}: Pole {pole_id} | {severity} | {confidence_pct}%")
        return

    try:
        subject = f"⚡ WattWatch Alert: {severity} Severity Theft Detected — {pole_id}"
        body = f"""
WattWatch Electricity Theft Detection System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 ANOMALY DETECTED

  User      : {to_addr}
  City      : {city}
  Pole ID   : {pole_id}
  Area      : {area}
  Expected  : {expected} kW
  Actual    : {actual} kW
  Mismatch  : {round(actual - expected, 2)} kW
  Confidence: {confidence_pct}%
  Severity  : {severity}
  Time      : {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}

Please investigate this node immediately.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WattWatch Sentinel System — Automated Alert
This message was triggered by your account: {to_addr}
        """
        msg = MIMEMultipart()
        msg['From']    = ALERT_EMAIL
        msg['To']      = to_addr
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(ALERT_EMAIL, ALERT_EMAIL_PASSWORD)
        server.sendmail(ALERT_EMAIL, to_addr, msg.as_string())
        server.quit()
        print(f"[EMAIL SENT] Alert sent to {to_addr} for pole {pole_id}")

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send alert: {e}")


def detect_theft(force=False, recipient_email: str = None):
    from collections import defaultdict

    if not force and grid_data.get("detection_cache"):
        return grid_data["detection_cache"]

    suspicious_transformers = []
    theft_nodes = []

    by_parent = defaultdict(list)
    poles = []
    transformers = []

    for n in grid_data["nodes"]:
        ntype = n["type"].lower()
        if ntype == "pole":
            poles.append(n)
            if n.get("parent_id"):
                by_parent[n["parent_id"]].append(n)
        elif ntype == "transformer":
            transformers.append(n)

    total_expected = round(sum(p.get("expected_load", 0) for p in poles), 2)
    total_actual   = round(sum(p.get("actual_load",   0) for p in poles), 2)
    total_loss     = round(total_actual - total_expected, 2)

    loss_percentage = 0.0
    if total_expected > 0:
        loss_percentage = round((total_loss / total_expected) * 100, 2)

    # ── One email per detection run per pole (dedup guard) ─────────────────
    emailed_poles = set()

    for t in transformers:
        child_poles          = by_parent.get(t["id"], [])
        sum_poles_expected   = sum(p.get("expected_load", 0) for p in child_poles)

        if abs(sum_poles_expected - t.get("actual_load", 0)) > THRESHOLD:
            suspicious_transformers.append(t["id"])

            for p in child_poles:
                actual   = p.get("actual_load",   0)
                expected = p.get("expected_load",  0)
                diff     = round(actual - expected, 2)

                if diff > THRESHOLD:
                    # ── Smart Confidence Score (Multi-Factor) ────────────────
                    # 1. Deviation factor (node's own mismatch ratio)
                    deviation = (diff / expected) if expected > 0 else 1.0
                    deviation = min(1.0, deviation)
                    
                    # 2. Transformer mismatch factor (parent's aggregate health)
                    t_mismatch = abs(sum_poles_expected - t.get("actual_load", 0))
                    t_factor = (t_mismatch / sum_poles_expected) if sum_poles_expected > 0 else 1.0
                    t_factor = min(1.0, t_factor)
                    
                    # 3. Time Series score (historical frequency)
                    occurrences = len([h for h in grid_data["history"] if h.get("id") == p["id"]])
                    ts_score = min(1.0, occurrences / 5.0) # Max suspicion after 5 reports
                    
                    # Weighted Formula: 0.4 Dev + 0.3 TF + 0.3 TS
                    confidence = (0.4 * deviation) + (0.3 * t_factor) + (0.3 * ts_score)
                    
                    confidence     = round(max(0.0, min(confidence, 1.0)), 4)
                    confidence_pct = round(confidence * 100, 2)
                    severity       = "High" if confidence >= 0.7 else "Medium" if confidence >= 0.4 else "Low"
                    timestamp      = datetime.datetime.now().isoformat()

                    alert_info = {
                        "id":             p["id"],
                        "area":           p.get("area", ""),
                        "lat":            p["lat"],
                        "lng":            p["lng"],
                        "time":           timestamp,
                        "actual_load":    actual,
                        "expected_load":  expected,
                        "mismatch":       diff,
                        "confidence":     confidence,
                        "confidence_pct": confidence_pct,
                        "severity":       severity,
                        "transformer":    t["id"],
                    }
                    theft_nodes.append(alert_info)

                    # ── Append to persistent history ─────────────────────────
                    grid_data["history"].append({
                        "id":             p["id"],
                        "area":           p.get("area", ""),
                        "time":           timestamp,
                        "confidence":     confidence,
                        "confidence_pct": confidence_pct,
                        "severity":       severity,
                        "expected_load":  expected,
                        "actual_load":    actual,
                        "mismatch":       diff,
                        "transformer":    t["id"],
                    })
                    if len(grid_data["history"]) > 200:
                        grid_data["history"] = grid_data["history"][-200:]

                    # ── Send email once per pole per run (dedup) ─────────────
                    if confidence > 0.5 and p["id"] not in emailed_poles:
                        emailed_poles.add(p["id"])
                        send_alert_email(
                            recipient      = recipient_email,
                            pole_id        = p["id"],
                            area           = p.get("area", "Unknown"),
                            expected       = expected,
                            actual         = actual,
                            confidence_pct = confidence_pct,
                            severity       = severity,
                            city           = grid_data.get("city", "Uploaded Grid"),
                        )

    result = {
        "city":                   "Uploaded Grid",
        "theft_nodes":            theft_nodes,
        "anomalies":              theft_nodes,        # alias for /detect-anomaly consumers
        "suspicious_transformers": suspicious_transformers,
        "summary": {
            "total_expected_load": total_expected,
            "total_actual_load":   total_actual,
            "total_loss":          total_loss,
            "loss_percentage":     loss_percentage,
            "severity":            "high" if loss_percentage > 15 else "medium" if loss_percentage > 5 else "low",
            "theft_count":         len(theft_nodes),
        },
    }

    grid_data["detection_cache"] = result
    return result
