import re

def find_chinese(filepath):
    print(f"--- {filepath} ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines):
        if re.search(r'[\u4e00-\u9fa5]', line):
            print(f"Line {i+1}: {line.strip()}")

find_chinese('index_en.html')
find_chinese('script_en.js')
