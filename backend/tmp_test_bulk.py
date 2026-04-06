import traceback
import sys
import os

# Add current dir to path to import db
sys.path.append(os.getcwd())

from ml.bulk_loader import bulk_loader

try:
    print("Starting bulk loader test...")
    bulk_loader()
    print("Finished bulk loader test.")
except Exception:
    traceback.print_exc()
