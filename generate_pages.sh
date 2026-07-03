#!/bin/bash
BASE="/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]"

create_client() {
  local dir=$1
  local name=$2
  local title=$3
  local icon=$4
  local sub=$5
  
  cat << TSX > "$BASE/$dir/${name}Client.tsx"
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, MessageCircle } from 'lucide-react';
import '@/styles/page-layout.css';

export default function ${name}Client({ locale = 'nl' }: { locale: string }) {
  const [search, setSearch] = useState('');

  return (
    <div className="pl-shell">
      <div className="pl-header">
        <div className="pl-header-inner">
          <nav className="pl-quick-nav-inner" style={{padding:0, border: 'none'}}>
            <Link href={\`/\${locale}\`} className="pl-qlink" style={{padding:'0 10px 0 0'}}>Home</Link>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" />
            <span className="pl-qlink" style={{color: 'rgba(255,255,255,0.4)'}}>${sub}</span>
          </nav>
          <div style={{width:'100%', marginTop: '16px'}}>
            <span className="pl-eyebrow">${icon} ${sub}</span>
            <h1 className="pl-title">${title}</h1>
            <p className="pl-subtitle">Ontdek het beste van Ibiza. Veilig en vertrouwd via Ibiza mi Vida.</p>
          </div>
          
          <div className="pl-search-wrap" style={{marginTop: '24px', width: '100%', maxWidth: '400px'}}>
            <Search size={16} className="pl-search-icon" />
            <input
              className="pl-search"
              placeholder="Zoeken..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="pl-tabs" style={{marginTop: '24px'}}>
          <button className="pl-tab active">${icon} ${title}</button>
        </div>
      </div>

      <div className="pl-body">
        <div className="pl-empty">
          <p>Resultaten laden...</p>
        </div>
        
        <div className="pl-wa-banner">
          <div>
            <strong>Persoonlijk advies nodig?</strong>
            <p>Stuur ons een bericht en we regelen het direct voor je.</p>
          </div>
          <a href="https://wa.me/34600000000" target="_blank" rel="noreferrer" className="pl-wa-btn">
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
TSX
}

# Op Het Water
create_client "shuttle-ferry" "ShuttleFerry" "Shuttle Ferry" "⛴️" "Op het Water"
create_client "ferry-formentera" "FerryFormentera" "Ferry Formentera" "🏝️" "Op het Water"
create_client "private-boat-charters" "PrivateBoatCharters" "Private Boat Charters" "⚓" "Op het Water"

# Beleef het eiland
create_client "activities" "Activities" "Activities & Buggies" "🏎️" "Beleef het Eiland"
create_client "tours" "Tours" "Eiland Tours" "🗺️" "Beleef het Eiland"
create_client "water-sports" "WaterSports" "Water Sports" "🏄" "Beleef het Eiland"
create_client "drink-packages" "DrinkPackages" "Drink Packages" "🍹" "Beleef het Eiland"
create_client "car-scooter-rental" "CarScooterRental" "Auto & Scooter Verhuur" "🛵" "Beleef het Eiland"

# Insider
create_client "guestlist" "Guestlist" "Gastenlijst" "VIP" "Insider"
create_client "ibiza-tips" "IbizaTips" "Ibiza Tips" "💡" "Insider"
create_client "blog" "Blog" "Blog & Nieuws" "📰" "Insider"
create_client "free-discount-ibiza" "FreeDiscountIbiza" "Free & Discount Ibiza" "🏷️" "Insider"

echo "Generated base clients"
