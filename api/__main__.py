from src.quart_project.app import run
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
run()
