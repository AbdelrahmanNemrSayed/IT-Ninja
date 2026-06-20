import re

file_path = r'C:\Users\abdo\.gemini\antigravity\brain\efc5ae0e-f775-4165-bbd5-680c423394d6\.system_generated\steps\3502\content.md'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

links = re.findall(r'https?://[^\s"\'<>\\)\]]+', content)
unique_links = set(links)

filtered_links = []
for l in unique_links:
    if 'gstatic' not in l and 'google' not in l and 'schema.org' not in l:
        filtered_links.append(l)

print(f"Found {len(filtered_links)} non-google links:")
for l in sorted(filtered_links):
    print(l)
