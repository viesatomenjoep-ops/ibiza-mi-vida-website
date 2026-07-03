'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, MessageCircle } from 'lucide-react';
import '@/styles/page-layout.css';

export default function DrinkPackagesClient({ locale = 'nl' }: { locale: string }) {
  const [search, setSearch] = useState('');

  return (
    <div className="pl-shell">
      <div className="pl-header">
        <div className="pl-header-inner">
          <nav className="pl-quick-nav-inner" style={{padding:0, border: 'none'}}>
            <Link href={`/${locale}`} className="pl-qlink" style={{padding:'0 10px 0 0'}}>Home</Link>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" />
            <span className="pl-qlink" style={{color: 'rgba(255,255,255,0.4)'}}>Beleef het Eiland</span>
          </nav>
          <div style={{width:'100%', marginTop: '16px'}}>
            <span className="pl-eyebrow">🍹 Beleef het Eiland</span>
            <h1 className="pl-title">Drink Packages</h1>
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
          <button className="pl-tab active">🍹 Drink Packages</button>
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
