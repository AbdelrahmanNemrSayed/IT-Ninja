import urllib.request
import urllib.parse
import json
import re

queries = [
    "CompTIA A+ 220-1101 free4arab playlist",
    "CompTIA A+ 220-1101 Professor Messer playlist",
    "CCNA 200-301 Free4arab احمد نظمي playlist",
    "CCNA 200-301 Jeremy IT Lab playlist",
    "Linux RHCSA Free4arab playlist",
    "Linux for Hackers HackerSploit playlist",
    "Windows Server 2022 Free4arab playlist",
    "Windows Server 2022 KevTech playlist",
    "VMware vSphere Free4arab playlist",
    "Proxmox full course NetworkChuck",
    "CompTIA Security+ SY0-701 Free4arab playlist",
    "CompTIA Security+ SY0-701 Professor Messer playlist",
    "بايثون الزيرو Elzero playlist",
    "PowerShell for Beginners freecodecamp",
    "Docker بالعربي خالد السعدني playlist",
    "Kubernetes TechWorld with Nana",
    "Terraform بالعربي playlist",
    "Ansible 101 Jeff Geerling playlist",
    "Prometheus Grafana بالعربي playlist",
    "Prometheus Grafana TechWorld with Nana",
    "WireGuard VPN NetworkChuck",
    "Zero Trust Architecture",
    "Vercel Firebase Net Ninja playlist"
]

def search_yt(query):
    html = urllib.request.urlopen("https://www.youtube.com/results?search_query=" + urllib.parse.quote(query))
    content = html.read().decode()
    playlist_ids = re.findall(r"playlist\?list=([a-zA-Z0-9_-]+)", content)
    video_ids = re.findall(r"watch\?v=([a-zA-Z0-9_-]{11})", content)
    
    if "playlist" in query.lower() and playlist_ids:
        return f"https://www.youtube.com/playlist?list={playlist_ids[0]}"
    if video_ids:
        return f"https://www.youtube.com/watch?v={video_ids[0]}"
    return None

for q in queries:
    print(f"{q}: {search_yt(q)}")
