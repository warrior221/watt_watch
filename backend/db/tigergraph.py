import pyTigerGraph as tg
import os
import threading
import requests
from dotenv import load_dotenv

load_dotenv()

# CRITICAL v1.7 PATCH: Ensure internal attributes exist before instantiation
tg.TigerGraphConnection._cached_token_auth = {}
tg.TigerGraphConnection._cached_pwd_auth = {}
tg.TigerGraphConnection._cached_pwd_auth_b64 = ""
if not hasattr(tg.TigerGraphConnection, "_local"):
    tg.TigerGraphConnection._local = threading.local()

__token_cache = None

def get_connection():
    global __token_cache
    
    tg_host = os.getenv("TG_HOST", "").strip()
    tg_graph = os.getenv("TG_GRAPH", "").strip()
    tg_secret_or_token = os.getenv("TG_TOKEN", "").strip()
    tg_user = os.getenv("TG_USERNAME", "").strip()
    tg_pass = os.getenv("TG_PASSWORD", "").strip()

    # We use a standard connection without tgCloud=True to prevent 
    # v1.7 from trying to manage auth internally in a way that fails.
    conn = tg.TigerGraphConnection(
        host=tg_host,
        graphname=tg_graph,
        username=tg_user,
        password=tg_pass,
        gsPort=443,
        restppPort=443
    )

    # Initialize auth dicts
    conn._cached_token_auth = {}
    conn._cached_pwd_auth = {}

    is_secret = len(tg_secret_or_token) == 32
    
    if is_secret and not __token_cache:
        try:
            print(f"WattWatch: Exchanging GSQL Secret starting with '{tg_secret_or_token[:4]}...' for Token...")
            # Manual REST call to get token if pyTigerGraph 1.7 getToken is problematic
            token_url = f"{tg_host}/gsqlserver/gsql/subtoken"
            payload = {"secret": tg_secret_or_token}
            res = requests.request("GET", token_url, params=payload, verify=False)
            
            if res.status_code == 200:
                data = res.json()
                __token_cache = data.get("token")
                print("WattWatch: Token received successfully via REST API.")
            else:
                # Fallback to library method
                token_data = conn.getToken(tg_secret_or_token)
                __token_cache = token_data[0] if isinstance(token_data, (list, tuple)) else token_data
                print("WattWatch: Token received successfully via Library.")
        except Exception as e:
            print(f"WattWatch: Auth Handshake failed: {e}")

    token_to_use = __token_cache or tg_secret_or_token

    if token_to_use:
        conn.apiToken = token_to_use
        # FORCE the internal dict that v1.7 uses for RESTpp requests (upsert, etc)
        # This is where 'REST-10016: Token is empty' comes from if not set.
        conn._cached_token_auth = {"Authorization": f"Bearer {token_to_use}"}
        
    return conn
