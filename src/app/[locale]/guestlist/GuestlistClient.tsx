'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle, FastForward, Clock, Percent } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-use styling

export default function GuestlistClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Gastenlijst Ibiza</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Gastenlijst</div>
          <h1 style={{ color: 'var(--sage)' }}>Op de gastenlijst <span className="accent" style={{ color: 'var(--blue)' }}>van de beste clubs</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Snel en persoonlijk geregeld. Geef je avond en je namen door via WhatsApp, en wij zorgen dat je op de lijst staat voor de club van jouw keuze.</p>
          <div className="hero-cta" style={{ marginTop: '24px' }}>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--green)', color: 'var(--sage)', fontWeight: 800, fontSize: '16px', padding: '15px 28px', borderRadius: '18px', transition: '.2s' }}>
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Zet me op de lijst
            </a>
            <span className="hero-note" style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: 'var(--sage-55)', fontWeight: 600 }}>Reactie meestal binnen enkele minuten</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Sneller naar binnen</div>
              <h2>Waarom de gastenlijst?</h2>
            </div>
          </div>
          
          <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '26px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="ic" style={{ width: '54px', height: '54px', background: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: '16px', borderRadius: '16px' }}>
                <FastForward size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>Gegarandeerde toegang</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14.5px' }}>Sta op de lijst voor de clubs die het aanbieden en kom vlotter binnen.</p>
            </div>

            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '26px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="ic" style={{ width: '54px', height: '54px', background: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: '16px', borderRadius: '16px' }}>
                <Clock size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>Tijd besparen</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14.5px' }}>Minder wachten bij de ingang, meer tijd op de dansvloer.</p>
            </div>

            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '26px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="ic" style={{ width: '54px', height: '54px', background: 'var(--mint)', display: 'grid', placeItems: 'center', marginBottom: '16px', borderRadius: '16px' }}>
                <Percent size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>Soms voordeliger</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14.5px' }}>Voor sommige nachten geldt een gunstiger entreetarief via de lijst.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block alt" style={{ background: 'var(--cream)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Zo werkt het</div>
              <h2>In 3 stappen op de lijst</h2>
            </div>
          </div>
          
          <div className="steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div className="step" style={{ background: '#fff', padding: '24px', borderRadius: '22px' }}>
              <div className="num" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--sage)', color: 'var(--cotton)', fontWeight: 900, display: 'grid', placeItems: 'center', marginBottom: '14px' }}>1</div>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, marginBottom: '6px' }}>Kies je avond</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14px' }}>Laat weten welke club, datum en met hoeveel personen je komt.</p>
            </div>

            <div className="step" style={{ background: '#fff', padding: '24px', borderRadius: '22px' }}>
              <div className="num" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--sage)', color: 'var(--cotton)', fontWeight: 900, display: 'grid', placeItems: 'center', marginBottom: '14px' }}>2</div>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, marginBottom: '6px' }}>App ons je gegevens</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14px' }}>Stuur via WhatsApp de namen door zoals ze op de lijst moeten staan.</p>
            </div>

            <div className="step" style={{ background: '#fff', padding: '24px', borderRadius: '22px' }}>
              <div className="num" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--sage)', color: 'var(--cotton)', fontWeight: 900, display: 'grid', placeItems: 'center', marginBottom: '14px' }}>3</div>
              <h3 style={{ fontSize: '16.5px', fontWeight: 800, marginBottom: '6px' }}>Bevestiging</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14px' }}>Wij zetten je op de lijst en bevestigen zodra het rond is.</p>
            </div>
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
              <h2>Op de gastenlijst van de beste clubs</h2>
              <p>Laat het ons weten via WhatsApp — we regelen het persoonlijk voor je.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Zet me op de lijst
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Gastenlijst voor clubs op Ibiza</h2>
          <p>De rij voorbij en zonder gedoe naar binnen: met de gastenlijst van Ibiza mi Vida regel je je plek voor de clubs die het aanbieden. Ideaal voor groepen die samen een avond willen plannen.</p>
          <p>Aanmelden gaat persoonlijk via WhatsApp. Geef de club, datum en namen door, en wij bevestigen zodra je op de lijst staat.</p>
        </div>
      </section>
    </>
  );
}
