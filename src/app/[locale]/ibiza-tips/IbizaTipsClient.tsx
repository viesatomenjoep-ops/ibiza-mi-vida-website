'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle, MapPin, Utensils, Sun, Compass, ArrowRight } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-use styling

export default function IbizaTipsClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Ibiza Tips</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Eiland Gids</div>
          <h1 style={{ color: 'var(--sage)' }}>Insider tips <span className="accent" style={{ color: 'var(--blue)' }}>voor jouw Ibiza-trip</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Verken het eiland voorbij de grote clubs. De leukste baaien, authentieke restaurants en verborgen plekken verzameld door ons team.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Onze favorieten</div>
              <h2>Artikelen & locaties</h2>
            </div>
          </div>
          
          <div className="media-grid">
            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Stranden</span>
                <MapPin size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>De 5 mooiste baaien in het noorden</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees meer
                </div>
              </div>
            </div>

            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Eten</span>
                <Utensils size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>Waar eet je de beste paella?</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees meer
                </div>
              </div>
            </div>

            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Zonsondergang</span>
                <Sun size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>Magische plekken voor zonsondergang</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees meer
                </div>
              </div>
            </div>

            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Geheim</span>
                <Compass size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>Ontdek het onbekende Ibiza</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees meer
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <span className="api-note"><span className="pulse"></span>Meer artikelen volgen snel</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{color:'var(--green)'}}>Vraag het ons</div>
              <h2>Specifieke plek gezocht?</h2>
              <p>Stuur ons een bericht en we denken graag met je mee over een route of locatie die bij jouw groep past.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> WhatsApp ons
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>De beste tips voor Ibiza</h2>
          <p>Ibiza is meer dan clubs alleen. Verborgen baaien, lokale restaurants en magische zonsondergangen maken je trip compleet. Op deze pagina verzamelen we onze favoriete plekken op het eiland.</p>
          <p>Heb je een specifieke vraag? App ons gerust — we denken graag mee over een route of plek die bij jou past.</p>
        </div>
      </section>
    </>
  );
}
