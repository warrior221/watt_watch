import os
from dotenv import load_dotenv

# Load sensitive keys and env variables from .env
load_dotenv()

# Read the threshold configuration securely
THRESHOLD = float(os.getenv("THRESHOLD", 0.5))
