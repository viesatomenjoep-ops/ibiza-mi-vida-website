import openpyxl
import re
from datetime import datetime
import json
import requests
import os

# Load env variables manually from .env.local
env_file = ".env.local"
env_vars = {}
try:
    with open(env_file) as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k] = v
except:
    pass

SUPABASE_URL = env_vars.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = env_vars.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing Supabase credentials!")
    exit(1)

excel_file = "Ibiza_Spotlight_Volledig_Seizoen_2026.xlsx"
wb = openpyxl.load_workbook(excel_file, data_only=True)
ws = wb["Alle Events 2026"]

venue_images = {
    "Pacha Ibiza": "https://images.unsplash.com/photo-1571266028243-e4d811c95a1f?w=800&q=85",
    "Ushuaïa Ibiza": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=85",
    "Hï Ibiza": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=85",
    "Amnesia": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85",
    "O Beach Ibiza": "https://images.unsplash.com/photo-1520759941054-c7a4e3fde7d3?w=800&q=85",
    "Ibiza Rocks Pool Club": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85",
    "Lío Ibiza": "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=85",
}
default_image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85"

events = []

rows = list(ws.iter_rows(min_row=2, values_only=True))
print(f"Total rows in Excel: {len(rows)}")

for idx, row in enumerate(rows):
    # row[0] is date, row[4] is venue, row[5] is event name
    # print(row) # debugging
    if not row[0] or not row[4] or not row[5]:
        continue
        
    try:
        date_obj = datetime.strptime(str(row[0]), "%d/%m/%Y")
        sql_date = date_obj.strftime("%Y-%m-%d")
    except:
        sql_date = "2026-07-01"
        
    title = row[5]
    venue = row[4]
    
    djs = row[6]
    time_str = f"Time: {row[2]}" if row[2] else ""
    if row[3]: time_str += f" - {row[3]}"
    
    subtitle = (djs[:250] if djs else "") or ""
    desc = (f"{time_str}. DJs: {djs}" if djs else time_str) or ""
    
    price = 0
    if row[7]:
        m = re.search(r'\d+', str(row[7]))
        if m: price = int(m.group(0))
        
    image_url = venue_images.get(venue, default_image)
    
    badge = 'Selling Fast' if idx % 20 == 0 else None
    if not badge: badge = 'New' if idx % 15 == 0 else None
    
    cat = "club-ticket"
    if "boat" in venue.lower(): cat = "boat-party"
    if "catamaran" in venue.lower(): cat = "catamaran"
    
    slug_venue = venue.lower().replace(" ", "-").replace("ï", "i").replace("[unvrs]", "unvrs").replace("ñ", "n")
    cta_href = f"/club-tickets/{slug_venue}"
    
    events.append({
        "title": title,
        "subtitle": subtitle,
        "description": desc,
        "image_url": image_url,
        "category": cat,
        "venue_name": venue,
        "event_date": sql_date,
        "price_from": price,
        "badge_text": badge,
        "cta_label": "Get Tickets",
        "cta_href": cta_href,
        "booking_type": "whatsapp",
        "sort_order": 0
    })

print(f"Extracted {len(events)} events.")

# Upload via requests
endpoint = f"{SUPABASE_URL}/rest/v1/featured_events"
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

chunk_size = 500
success = 0
for i in range(0, len(events), chunk_size):
    chunk = events[i:i+chunk_size]
    r = requests.post(endpoint, headers=headers, json=chunk)
    if r.status_code in (200, 201):
        success += len(chunk)
        print(f"Uploaded {success}/{len(events)}...")
    else:
        print(f"Error uploading chunk {i}: {r.status_code} - {r.text}")

print("Upload complete!")
