import pyTigerGraph as tg
import os
import threading
from dotenv import load_dotenv

load_dotenv()

# Singleton to cache the token for performance after swapping a secret
__token_cache = None

def get_connection():
    global __token_cache
    
    tg_host = os.getenv("TG_HOST", "").strip()
    tg_graph = os.getenv("TG_GRAPH", "").strip()
    tg_secret_or_token = os.getenv("TG_TOKEN", "").strip()
    tg_user = os.getenv("TG_USERNAME", "").strip()
    tg_pass = os.getenv("TG_PASSWORD", "").strip()

    # Pre-patch threading support
    if not hasattr(tg.TigerGraphConnection, "_local"):
        tg.TigerGraphConnection._local = threading.local()

    conn = tg.TigerGraphConnection(
        host=tg_host,
        graphname=tg_graph,
        username=tg_user,
        password=tg_pass,
        tgCloud=True,
        gsPort=443,
        restppPort=443
    )

    # SECURE HANDSHAKE:
    # If using a short (32-char) string, it's a GSQL Secret that must be exchanged for a JWT Token.
    is_secret = len(tg_secret_or_token) == 32
    effective_token = __token_cache or (tg_secret_or_token if not is_secret else None)

    if is_secret and not __token_cache:
        try:
            print("WattWatch: Exchanging GSQL Secret for API Token...")
            token_data = conn.getToken(tg_secret_or_token)
            __token_cache = token_data[0] if isinstance(token_data, (list, tuple)) else token_data
            effective_token = __token_cache
            print("WattWatch: Token received successfully.")
        except Exception as e:
            print(f"WattWatch: Handshake error: {e}")

    # Set the token on the connection
    if effective_token:
        conn.apiToken = effective_token
        # Fix for some versions of pyTigerGraph losing auth context on Cloud:
        tg.TigerGraphConnection._cached_token_auth = {"Authorization": f"Token {effective_token}"}
        tg.TigerGraphConnection._cached_pwd_auth = {}

    return conn