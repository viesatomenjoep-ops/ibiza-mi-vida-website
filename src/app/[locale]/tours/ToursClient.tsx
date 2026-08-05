'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, MessageCircle } from 'lucide-react';
import '@/styles/page-layout.css';

export default function ToursClient({ locale = 'nl' }: { locale: string }) {
  const [search, setSearch] = useState('');

  return (
    <div className="pl-shell">
      <div className="pl-header">
        <div className="pl-header-inner">
          
          <div style={{width:"100%"}}>
            
            <h1 className="pl-title">Eiland Tours</h1>
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
          <button className="pl-tab active">🗺️ Eiland Tours</button>
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
          <a href="https://wa.me/33666528412" target="_blank" rel="noreferrer" className="pl-wa-btn">
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
