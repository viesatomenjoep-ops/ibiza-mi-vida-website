import openpyxl
import re
from datetime import datetime
import json

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
for idx, row in enumerate(rows):
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
    
    subtitle = djs[:250] if djs else ""
    desc = f"{time_str}. DJs: {djs}" if djs else time_str
    
    price = 0
    if row[7]:
        m = re.search(r'\\d+', str(row[7]))
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

with open("events_data.json", "w") as f:
    json.dump(events, f, indent=2)

print(f"Generated events_data.json with {len(events)} events.")
