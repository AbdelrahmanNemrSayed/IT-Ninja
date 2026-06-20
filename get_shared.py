import urllib.request
import re
import json

url = 'https://gemini.google.com/share/Ms30PySaNgXN'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # The conversation is usually stored in WIZ_global_data or AF_initDataCallback
    # Let's extract all strings that look like http
    links = re.findall(r'https?://[^\s"\'<>\\)\]]+', html)
    unique_links = set(links)

    filtered_links = []
    for l in unique_links:
        if 'gstatic' not in l and 'google' not in l and 'schema.org' not in l:
            filtered_links.append(l)

    print(f"Found {len(filtered_links)} non-google links:")
    for l in sorted(filtered_links):
        print(l)
        
    # Also extract YouTube links hidden in unicode escapes like \u003d
    raw_links = re.findall(r'(https?://(?:www\.)?youtube\.com/watch\?v\\[uU]003d[a-zA-Z0-9_-]+)', html)
    raw_links += re.findall(r'(https?://youtu\.be/[a-zA-Z0-9_-]+)', html)
    
    print("\nExtracted raw YT links:")
    for l in set(raw_links):
        print(l.replace('\\u003d', '=').replace('\\U003d', '='))
except Exception as e:
    print("Error:", e)
