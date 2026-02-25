import re

with open('script_en.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Checking for unescaped quotes or obvious syntax issues
import traceback
try:
    import ast
    # JavaScript is not Python, we can't parse it with ast
except SyntaxError:
    pass

lines = text.split('\n')
for i, line in enumerate(lines):
    if "``" in line or '""' in line or "''" in line:
        pass # print(f"Line {i+1}: {line}")
