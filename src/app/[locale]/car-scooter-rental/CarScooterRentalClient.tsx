'use client';

import React, { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { plCopy } from '@/lib/pl-i18n';
import '@/styles/page-layout.css';

export default function CarScooterRentalClient({ locale = 'nl' }: { locale: string }) {
  const [search, setSearch] = useState('');
  const C = plCopy('car-scooter-rental', locale);

  return (
    <div className="pl-shell">
      <div className="pl-header">
        <div className="pl-header-inner">
          <div style={{width:"100%"}}>
            <h1 className="pl-title">{C.title}</h1>
            <p className="pl-subtitle">{C.subtitle}</p>
          </div>
          <div className="pl-search-wrap" style={{marginTop: '24px', width: '100%', maxWidth: '400px'}}>
            <Search size={16} className="pl-search-icon" />
            <input
              className="pl-search"
              placeholder={C.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="pl-tabs" style={{marginTop: '24px'}}>
          <button className="pl-tab active">{C.tab}</button>
        </div>
      </div>

      <div className="pl-body">
        <div className="pl-empty">
          <p>{C.emptyText}</p>
        </div>

        <div className="pl-wa-banner">
          <div>
            <strong>{C.waTitle}</strong>
            <p>{C.waText}</p>
          </div>
          <a href="https://wa.me/33666528412" target="_blank" rel="noreferrer" className="pl-wa-btn">
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
