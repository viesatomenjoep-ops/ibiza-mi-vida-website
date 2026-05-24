import openpyxl
import re
from datetime import datetime
import json

excel_file = "Ibiza_Spotlight_Volledig_Seizoen_2026.xlsx"
sql_file = "supabase/migrations/008_import_all_events.sql"

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

def escape_sql(val):
    if val is None:
        return 'NULL'
    return "'" + str(val).replace("'", "''") + "'"

with open(sql_file, "w") as f:
    f.write("-- ============================================================\n")
    f.write("-- Ibiza mi vida — Migration 008: Import 2026 Spotlight Events\n")
    f.write("-- Auto-generated from Python scraper\n")
    f.write("-- ============================================================\n\n")
    
    # We will do chunks of 1000 inserts to avoid parsing issues
    insert_header = """INSERT INTO featured_events 
  (title, subtitle, description, image_url, category, venue_name, event_date, price_from, badge_text, cta_label, cta_href, booking_type, sort_order)
VALUES\n"""
    
    chunk = []
    chunk_size = 500
    
    # Skip header row
    rows = list(ws.iter_rows(min_row=2, values_only=True))
    for idx, row in enumerate(rows):
        if not row[0] or not row[4] or not row[5]:
            continue
            
        # 0=Datum, 1=Dag, 2=Start, 3=Eind, 4=Venue, 5=Event, 6=DJs, 7=Prijs
        # parse date dd/mm/yyyy -> yyyy-mm-dd
        try:
            date_obj = datetime.strptime(str(row[0]), "%d/%m/%Y")
            sql_date = date_obj.strftime("%Y-%m-%d")
        except:
            sql_date = "2026-07-01" # fallback
            
        title = row[5]
        venue = row[4]
        
        # Build description
        djs = row[6]
        time_str = f"Time: {row[2]}" if row[2] else ""
        if row[3]: time_str += f" - {row[3]}"
        
        subtitle = djs[:250] if djs else ""
        desc = f"{time_str}. DJs: {djs}" if djs else time_str
        
        # parse price
        price = 0
        if row[7]:
            m = re.search(r'\\d+', str(row[7]))
            if m: price = int(m.group(0))
            
        image_url = venue_images.get(venue, default_image)
        
        # Badge
        badge = 'Selling Fast' if idx % 20 == 0 else ''
        if not badge: badge = 'New' if idx % 15 == 0 else 'null'
        
        cat = "club-ticket"
        if "boat" in venue.lower(): cat = "boat-party"
        if "catamaran" in venue.lower(): cat = "catamaran"
        
        slug_venue = venue.lower().replace(" ", "-").replace("ï", "i").replace("[unvrs]", "unvrs").replace("ñ", "n")
        cta_href = f"/club-tickets/{slug_venue}"
        
        val_str = f"({escape_sql(title)}, {escape_sql(subtitle)}, {escape_sql(desc)}, {escape_sql(image_url)}, {escape_sql(cat)}, {escape_sql(venue)}, {escape_sql(sql_date)}, {price}, "
        if badge == 'null':
            val_str += "NULL, "
        else:
            val_str += f"{escape_sql(badge)}, "
        val_str += f"'Get Tickets', {escape_sql(cta_href)}, 'whatsapp', 0)"
        
        chunk.append(val_str)
        
        if len(chunk) >= chunk_size:
            f.write(insert_header)
            f.write(",\n".join(chunk))
            f.write(";\n\n")
            chunk = []
            
    if chunk:
        f.write(insert_header)
        f.write(",\n".join(chunk))
        f.write(";\n\n")

print(f"✅ Generated migration 008 with {len(rows)} events.")
