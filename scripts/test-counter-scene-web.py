#!/usr/bin/env python3
"""Compatibility entry point for the redesigned PC counter browser checks."""
from pathlib import Path
import runpy

if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).with_name('test-strict-counter-web.py')), run_name='__main__')
