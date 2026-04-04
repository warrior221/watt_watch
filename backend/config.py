import os
from dotenv import load_dotenv

load_dotenv()

# Anomaly detection threshold (kW)
THRESHOLD = float(os.getenv("THRESHOLD", 0.5))

# SMTP Email Alert Configuration
# Set these in your .env file to enable real email alerts
ALERT_EMAIL           = os.getenv("ALERT_EMAIL", "")           # sender Gmail address
ALERT_EMAIL_PASSWORD  = os.getenv("ALERT_EMAIL_PASSWORD", "")   # Gmail App Password (16-char)
ALERT_RECIPIENT       = os.getenv("ALERT_RECIPIENT", "")         # destination email address
