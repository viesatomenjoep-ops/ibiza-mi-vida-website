'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Ship, ChevronRight, MapPin, Calendar, MessageCircle, Filter } from 'lucide-react';
import '@/styles/club-tickets.css';

type BoatVenue = {
  id: string;
  slug: string;
  name: string;
  cover?: string;
  whitelogo?: string;
  type_slug?: string;
  description?: string;
};

type BoatEvent = {
  id: string;
  name: string;
  date: string;
  prices?: string;
  ct_venues?: { name?: string; slug?: string; cover?: string };
};

const SUB_CATEGORIES = [
  { id: 'all', label: 'Alle Bootfeesten', icon: '🚢' },
  { id: 'boat-party', label: 'Ibiza Boat Party', icon: '🎉' },
  { id: 'shuttle', label: 'Shuttle Ferry', icon: '⛴️' },
  { id: 'formentera', label: 'Ferry Formentera', icon: '🏝️' },
  { id: 'private', label: 'Private Charters', icon: '⚓' },
];

export default function BoatPartiesClient({
  venues = [],
  events = [],
  locale = 'nl',
}: {
  venues: BoatVenue[];
  events: BoatEvent[];
  locale: string;
}) {
  const [search, setSearch] = useState('');
  const [activeSubCat, setActiveSubCat] = useState('all');

  const filtered = useMemo(() => {
    let v = [...venues];
    if (search) v = v.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
    return v;
  }, [venues, search]);

  return (
    <div className="ct-shell">
      {/* ── HEADER ── */}
      <div className="ct-header">
        <div className="ct-header-inner">
          <nav className="ct-breadcrumb">
            <Link href={`/${locale}`}>Home</Link>
            <ChevronRight size={12} />
            <span>Op het Water</span>
          </nav>
          <div className="ct-header-title">
            <span className="ct-eyebrow"><Ship size={14} /> Op het Water</span>
            <h1 className="ct-title">Bootfeesten & Ferries</h1>
            <p className="ct-subtitle">
              Van wilde boat parties tot rustige Formentera-ferries. Boek officieel via Clubtickets.
            </p>
          </div>
          <div className="ct-search-wrap">
            <Search size={16} className="ct-search-icon" />
            <input
              className="ct-search"
              placeholder="Zoek boot, route of party..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Sub-category tabs */}
        <div className="ct-tabs">
          {SUB_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`ct-tab ${activeSubCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveSubCat(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="ct-quick-links-bar">
        <Link href={`/${locale}/boat-parties`} className="ct-qlink active">🚢 Bootfeesten</Link>
        <Link href={`/${locale}/shuttle-ferry`} className="ct-qlink">⛴️ Shuttle Ferry</Link>
        <Link href={`/${locale}/ferry-formentera`} className="ct-qlink">🏝️ Formentera Ferry</Link>
        <Link href={`/${locale}/private-boat-charters`} className="ct-qlink">⚓ Private Charters</Link>
      </div>

      {/* ── BODY ── */}
      <div className="ct-body">
        <div className="ct-stream">
          {/* Stats bar */}
          <div className="ct-stats-bar">
            <div className="ct-stat">
              <span className="ct-stat-val">{filtered.length}</span>
              <span className="ct-stat-lbl">Boten & Routes</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-val">{events.length}</span>
              <span className="ct-stat-lbl">Aankomende events</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-val">100%</span>
              <span className="ct-stat-lbl">Officieel via Clubtickets</span>
            </div>
          </div>

          {/* Event cards from API */}
          {events.length > 0 && (
            <div className="ct-section">
              <div className="ct-section-head">
                <span className="ct-section-label">Aankomende Bootfeesten</span>
              </div>
              <div className="ct-grid">
                {events.map(ev => (
                  <Link
                    key={ev.id}
                    href={`/${locale}/club-tickets/${ev.ct_venues?.slug || 'boat'}/${ev.id}`}
                    className="ct-card"
                  >
                    <div className="ct-card-img">
                      {ev.ct_venues?.cover ? (
                        <Image src={ev.ct_venues.cover} alt={ev.name} fill className="object-cover" />
                      ) : (
                        <div className="ct-card-ph"><Ship size={32} /></div>
                      )}
                      <span className="ct-card-badge">Boot Party</span>
                    </div>
                    <div className="ct-card-body">
                      <div className="ct-card-venue">{ev.ct_venues?.name}</div>
                      <h3 className="ct-card-title">{ev.name}</h3>
                      <div className="ct-card-meta">
                        <Calendar size={12} /> {new Date(ev.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'short' })}
                        {ev.prices && <><span className="ct-dot" /> Vanaf {ev.prices}</>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Venues/boats grid */}
          {filtered.length > 0 ? (
            <div className="ct-section">
              <div className="ct-section-head">
                <span className="ct-section-label">Boten & Operators</span>
              </div>
              <div className="ct-grid">
                {filtered.map(v => (
                  <Link
                    key={v.id}
                    href={`/${locale}/club-tickets/${v.slug}`}
                    className="ct-card"
                  >
                    <div className="ct-card-img">
                      {v.cover ? (
                        <Image src={v.cover} alt={v.name} fill className="object-cover" />
                      ) : (
                        <div className="ct-card-ph"><Ship size={32} /></div>
                      )}
                    </div>
                    <div className="ct-card-body">
                      <h3 className="ct-card-title">{v.name}</h3>
                      <div className="ct-card-meta"><Ship size={12} /> Boot & Ferry</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="ct-empty">
              <Ship size={40} />
              <p>Geen boten gevonden {search && `voor "${search}"`}</p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="ct-wa-banner">
            <div>
              <strong>Private boot nodig?</strong>
              <p>Stuur ons een bericht en we regelen het.</p>
            </div>
            <a href="https://wa.me/34600000000" target="_blank" rel="noreferrer" className="ct-wa-btn">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
