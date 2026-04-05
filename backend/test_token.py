import pyTigerGraph as tg
import os
import threading
from dotenv import load_dotenv

load_dotenv()

conn = tg.TigerGraphConnection(
    host=os.getenv("TG_HOST", "").strip(),
    graphname=os.getenv("TG_GRAPH", "").strip(),
    username=os.getenv("TG_USERNAME", "").strip(),
    password=os.getenv("TG_PASSWORD", "").strip(),
    tgCloud=True,
    gsPort=443,
    restppPort=443
)
if not hasattr(tg.TigerGraphConnection, "_local"):
    tg.TigerGraphConnection._local = threading.local()

try:
    secret = conn.createSecret()
    print("SECRET:", secret)
    token = conn.getToken(secret)
    print("NEW TOKEN:", token)
except Exception as e:
    print("FAILED:", e)
