import re

def update_file(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_url, new_url in replacements.items():
        if old_url in content:
            content = content.replace(old_url, new_url)
            
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Define replacements for roadmapData.js
roadmap_replacements = {
    # Phase 0
    "https://www.youtube.com/playlist?list=PLLlr6jKKdyK2i60473jKolHvnZ359EbWf": "https://www.youtube.com/playlist?list=PL77yNtB4-LjnN2FU3h1v5hIJOHZfW9ugq",
    "كورس CompTIA A+ بالعربي - Free4arab": "كورس CompTIA A+ بالعربي - المهندس أحمد حسن",
    "https://www.youtube.com/playlist?list=PLG49S3nxzAnlGHYsF9IaPf9A8H85GBsJ1": "https://www.youtube.com/playlist?list=PLG49S3nxzAnlGHYsF9IaPf9A8H85GBsJ1", # No change if same, but let's be sure
    "CompTIA A+ Full Course - Professor Messer": "CompTIA A+ Course - Professor Messer",
    
    # Phase 1
    "https://www.youtube.com/playlist?list=PLLlr6jKKdyK3JYsGq_jEcNx-EHF4lqXHP": "https://www.youtube.com/playlist?list=PLB560a63H3_a1P9H13pL5v-8oP_T42T0p",
    "كورس CCNA 200-301 بالعربي - Free4arab": "كورس CCNA بالعربي - المهندس أحمد نظمي",
    "Free CCNA 200-301 - Jeremy's IT Lab": "CCNA Course - Jeremy's IT Lab",
    
    # Phase 2
    "https://www.youtube.com/playlist?list=PLvbyo73L4vfvxbFgbbCSNNWqO1HGvrws9": "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1f8p8ajyYtXP9GxdFH7WIU",
    "كورس Linux RHCSA - Free4arab": "كورس Linux RHCSA - المهندسة عبير حسني",
    "Linux for Beginners - freeCodeCamp": "Linux Server Administration - Learn Linux TV",
    "https://www.youtube.com/watch?v=sWbUDq4S6Y8": "https://www.youtube.com/playlist?list=PLT98CRl2KxGGPLw0KHb5F4N5ypgcUXsLy",
    
    # Phase 3
    "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1llkvqlu4DSqtYN46fQo92": "https://www.youtube.com/playlist?list=PLLlr6jKKdyK1llkvqlu4DSqtYN46fQo92",
    "ويندوز سيرفر 2022 بالعربي - Free4arab": "ويندوز سيرفر بالعربي - المهندس محمد الطناني",
    "Active Directory Training - Kevtech": "Active Directory & IT Support - Kevtech IT Support",
    
    # Phase 4
    "https://www.youtube.com/playlist?list=PLLlr6jKKdyK38sTiACRPapBUCLXnbcYOp": "https://www.youtube.com/@mohamedzohdy",
    "شرح VMware vSphere - Free4arab": "شرح الحوسبة السحابية و Azure - المهندس محمد زهدي",
    "Virtualization Technologies - NetworkChuck": "Azure & Virtualization Fundamentals - John Savill",
    "https://www.youtube.com/playlist?list=PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1P": "https://www.youtube.com/@ntfaqguy",
    
    # Phase 5
    "https://www.youtube.com/playlist?list=PLAQ9093fDW_bDj8o3n7hMjaIZgVimhCHI": "https://www.youtube.com/playlist?list=PLLlr6jKKdyK0G8jXNlL-tHR-7FO4vgXkb",
    "كورس CompTIA Security+ SY0-701 بالعربي - Free4Arab": "كورس CompTIA Security+ بالعربي - قناة Free4Arab",
    "Security+ SY0-701 - Professor Messer": "CompTIA Security+ Course - Professor Messer",
    "https://www.youtube.com/playlist?list=PLG49S3nxzAnnVhoQgTGvSm4qV1A1PptX9": "https://www.youtube.com/user/professormesser",
    
    # Phase 6
    "https://www.youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs": "https://www.youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mSry",
    "تعلم لغة بايثون للأنظمة - الزيرو ويب سكول (Elzero)": "تعلم لغة بايثون للأنظمة - الزيرو ويب سكول",
    "Python for Beginners - Programming with Mosh": "AWS Cloud Practitioner Course - FreeCodeCamp",
    "https://www.youtube.com/watch?v=kqtD5dpn9C8": "https://www.youtube.com/watch?v=7HKot-brXFE",
    
    # Phase 7
    "https://www.youtube.com/playlist?list=PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ": "https://www.youtube.com/playlist?list=PLm2M9B6tHnF63jZ6H6yP59iP1J-7g2-8C",
    "دورة دوكر وكوبيرنيتس بالعربي - خالد السعدني": "دورة دوكر وكوبيرنيتس بالعربي - المهندس عبد أبوغزالة",
    "Docker & Kubernetes - TechWorld with Nana": "Kubernetes Tutorial - TechWorld with Nana",
    "https://www.youtube.com/watch?v=3c-iBn73dDE": "https://www.youtube.com/watch?v=X48VuDVv0do",
    
    # Phase 8
    "https://www.youtube.com/playlist?list=PLX1bW_GeBRhBIT9-Nyt4_osatqokaN8ae": "https://www.youtube.com/playlist?list=PLCIJjtxA3eXT4O8QYm0f4u73Z9Z0lE1vJ",
    "شرح أداة Terraform بالعربي - Free4arab": "شرح أداة Terraform بالعربي - المهندس محمد الشريف",
    "Ansible 101 Course - Jeff Geerling": "Ansible 101 Course - Jeff Geerling",
    "https://www.youtube.com/playlist?list=PL2_OBreMn7FqZkvMYt6ATmgC0KAGGJNAN": "https://www.youtube.com/playlist?list=PL2_OB-tmK9Y9p2E17w58m6sFq-s15Q9_C",
    
    # Phase 9
    "https://www.youtube.com/playlist?list=PLhW3qG5bs-L9NMEkZ0y44Z1qH86pU6jR-": "https://www.youtube.com/@DevOpsArea",
    "شرح Prometheus & Grafana - محمود رمضان": "Prometheus & Grafana - DevOps Area",
    "Prometheus Monitoring - TechWorld with Nana": "Prometheus & Grafana Setup - TechWorld with Nana",
    
    # Phase 10
    "https://www.youtube.com/playlist?list=PLm2M9B6tHnF6H016Y4fB0LWe1d2Vv1FqF": "https://www.youtube.com/watch?v=N6O3qw9QyqU",
    "تأمين البنية التحتية Zero Trust - عبد أبوغزالة": "تأمين الشبكات والاتصال الآمن - قناة هارفارد عربي",
    "Zero Trust Architecture Explained - IBM Technology": "Web Networks & Security - Hussein Nasser",
    "https://www.youtube.com/watch?v=rWbQn6a-n18": "https://www.youtube.com/@hnasr",
    
    # Phase 11
    "https://www.youtube.com/playlist?list=PLm2M9B6tHnF57P17sV12-pL8W2u3-i00j": "https://www.youtube.com/watch?v=2H-L7S6yX7w",
    "استضافة ونشر المشاريع - عبد أبوغزالة": "شرح نشر وتطوير خوادم الويب السحابية - يوتيوب",
    "Deploying Web Apps - Traversy Media": "Modern Web Deployment & Firebase - Net Ninja",
    "https://www.youtube.com/watch?v=rX_vjWf4cR8": "https://www.youtube.com/watch?v=sBws8MSXN7A"
}

update_file(r'd:\Code Projects\IT_Plan\src\data\roadmapData.js', roadmap_replacements)
print("Updated roadmapData.js")
