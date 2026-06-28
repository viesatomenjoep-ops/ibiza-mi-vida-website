'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Map, Tag, Ticket } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-use styling

export default function FreeDiscountIbizaClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Gratis & Korting</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Deals & Tips</div>
          <h1 style={{ color: 'var(--sage)' }}>Ibiza voor minder <span className="accent" style={{ color: 'var(--blue)' }}>gratis & met korting</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Een geweldige trip hoeft niet de hoofdprijs te kosten. Ontdek gratis beach clubs, ontvang kortingscodes voor feestjes en kom binnen op free-entry avonden.</p>
          <div className="hero-cta" style={{ marginTop: '24px' }}>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--green)', color: 'var(--sage)', fontWeight: 800, fontSize: '16px', padding: '15px 28px', borderRadius: '18px', transition: '.2s' }}>
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Vraag naar de deals
            </a>
            <span className="hero-note" style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: 'var(--sage-55)', fontWeight: 600 }}>Reactie meestal binnen enkele minuten</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Slim besparen</div>
              <h2>Gratis & met korting</h2>
              <p>Voorbeeldindeling — de aanbiedingen vullen wij zelf in.</p>
            </div>
          </div>
          
          <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '26px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              <span className="price-tag" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--mint)', color: 'var(--sage)', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '999px' }}>Gratis</span>
              <div className="ic" style={{ width: '54px', height: '54px', background: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: '16px', borderRadius: '16px' }}>
                <Map size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>Gratis beach clubs</h3>
              <div className="ph-line" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="ph-line s" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px', width: '70%' }}></div>
              <p style={{ marginTop: '10px', color: 'var(--sage-80)', fontSize: '14.5px' }}>Overzicht van gratis plekken vullen wij zelf in.</p>
            </div>

            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '26px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              <span className="price-tag" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--mint)', color: 'var(--sage)', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '999px' }}>Korting</span>
              <div className="ic" style={{ width: '54px', height: '54px', background: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: '16px', borderRadius: '16px' }}>
                <Tag size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>Kortingscodes</h3>
              <div className="ph-line" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="ph-line s" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px', width: '70%' }}></div>
              <p style={{ marginTop: '10px', color: 'var(--sage-80)', fontSize: '14.5px' }}>Actuele codes voor tickets vullen wij zelf in.</p>
            </div>

            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '26px', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              <span className="price-tag" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--mint)', color: 'var(--sage)', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '999px' }}>Deal</span>
              <div className="ic" style={{ width: '54px', height: '54px', background: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: '16px', borderRadius: '16px' }}>
                <Ticket size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>Free entry lijsten</h3>
              <div className="ph-line" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="ph-line s" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px', width: '70%' }}></div>
              <p style={{ marginTop: '10px', color: 'var(--sage-80)', fontSize: '14.5px' }}>Avonden met gratis entree vullen wij zelf in.</p>
            </div>
          </div>

          <div style={{ marginTop: '18px' }}>
            <span className="api-note"><span className="pulse"></span>Aanbiedingen voegen wij zelf toe</span>
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
              <div className="kicker" style={{color:'var(--green)'}}>Persoonlijk geregeld</div>
              <h2>Ibiza voor minder gratis & met korting</h2>
              <p>Laat het ons weten via WhatsApp — we regelen het persoonlijk voor je.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Vraag de deals via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Ibiza op een budget</h2>
          <p>Een onvergetelijke trip naar Ibiza hoeft je spaarrekening niet leeg te trekken. Met gratis beach clubs, kortingscodes en free-entry avonden geniet je van het eiland voor minder.</p>
          <p>De actuele deals delen we persoonlijk via WhatsApp, omdat codes en aanbiedingen snel wisselen. App ons voor wat er nu beschikbaar is.</p>
        </div>
      </section>
    </>
  );
}
