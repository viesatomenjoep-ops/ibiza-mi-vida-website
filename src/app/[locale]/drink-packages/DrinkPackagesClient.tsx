'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle, GlassWater, Wine, PartyPopper } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-use styles

export default function DrinkPackagesClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Drankpakketten</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Drankpakketten</div>
          <h1 style={{ color: 'var(--sage)' }}>Drankpakketten <span className="accent" style={{ color: 'var(--blue)' }}>voor je Ibiza-trip</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Geen gedoe met losse bestellingen — kies een pakket en wij zetten alles klaar. Reserveren en je wensen doorgeven doe je rechtstreeks via WhatsApp.</p>
          <div className="hero-cta" style={{ marginTop: '24px' }}>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--green)', color: 'var(--sage)', fontWeight: 800, fontSize: '16px', padding: '15px 28px', borderRadius: '18px', transition: '.2s' }}>
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Reserveer via WhatsApp
            </a>
            <span className="hero-note" style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: 'var(--sage-55)', fontWeight: 600 }}>Reactie meestal binnen enkele minuten</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Stel je pakket samen</div>
              <h2>Onze drankpakketten</h2>
              <p>Voorbeeldpakketten — de definitieve inhoud en prijzen geven wij zelf in. Reserveren gaat via WhatsApp.</p>
            </div>
          </div>
          
          <div className="listing" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '30px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span className="price-tag" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--mint)', color: 'var(--sage)', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '999px' }}>Prijs op aanvraag</span>
              <div className="ic" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cream)', display: 'grid', placeItems: 'center', marginBottom: '20px' }}>
                <GlassWater size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Starter pakket</h3>
              <div className="ph-line" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="ph-line s" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px', width: '70%' }}></div>
              <p style={{ marginTop: '16px', color: 'var(--sage-80)', fontSize: '14.5px' }}>Omschrijving van het pakket vullen wij zelf in.</p>
            </div>

            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '30px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span className="price-tag" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--mint)', color: 'var(--sage)', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '999px' }}>Prijs op aanvraag</span>
              <div className="ic" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cream)', display: 'grid', placeItems: 'center', marginBottom: '20px' }}>
                <Wine size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Premium pakket</h3>
              <div className="ph-line" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="ph-line s" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px', width: '70%' }}></div>
              <p style={{ marginTop: '16px', color: 'var(--sage-80)', fontSize: '14.5px' }}>Omschrijving van het pakket vullen wij zelf in.</p>
            </div>

            <div className="ccard" style={{ background: '#fff', border: '1px solid rgba(44,74,66,.07)', borderRadius: '22px', padding: '30px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
              <span className="price-tag" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--mint)', color: 'var(--sage)', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '999px' }}>Prijs op aanvraag</span>
              <div className="ic" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cream)', display: 'grid', placeItems: 'center', marginBottom: '20px' }}>
                <PartyPopper size={26} style={{ stroke: 'var(--sage)' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>VIP pakket</h3>
              <div className="ph-line" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="ph-line s" style={{ height: '8px', background: 'rgba(44,74,66,.06)', borderRadius: '4px', marginBottom: '8px', width: '70%' }}></div>
              <p style={{ marginTop: '16px', color: 'var(--sage-80)', fontSize: '14.5px' }}>Omschrijving van het pakket vullen wij zelf in.</p>
            </div>

          </div>
          
          <div style={{ marginTop: '24px' }}>
            <span className="api-note"><span className="pulse"></span>Inhoud & prijzen voegen wij zelf toe</span>
          </div>

        </div>
      </section>

      <section className="block alt" style={{ background: 'var(--cream)' }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Zo werkt het</div>
              <h2>In 3 stappen geregeld</h2>
            </div>
          </div>
          
          <div className="steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            
            <div className="step" style={{ background: '#fff', padding: '24px', borderRadius: '20px' }}>
              <div className="num" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green)', color: 'var(--sage)', fontWeight: 800, display: 'grid', placeItems: 'center', marginBottom: '16px' }}>1</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Kies je pakket</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14.5px' }}>Bekijk de opties en kies wat bij je groep en budget past.</p>
            </div>

            <div className="step" style={{ background: '#fff', padding: '24px', borderRadius: '20px' }}>
              <div className="num" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green)', color: 'var(--sage)', fontWeight: 800, display: 'grid', placeItems: 'center', marginBottom: '16px' }}>2</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Stuur ons een bericht</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14.5px' }}>Via WhatsApp geef je je wensen, datum en aantal personen door.</p>
            </div>

            <div className="step" style={{ background: '#fff', padding: '24px', borderRadius: '20px' }}>
              <div className="num" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green)', color: 'var(--sage)', fontWeight: 800, display: 'grid', placeItems: 'center', marginBottom: '16px' }}>3</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Wij regelen de rest</h3>
              <p style={{ color: 'var(--sage-80)', fontSize: '14.5px' }}>Je krijgt een bevestiging en het pakket staat klaar voor je aankomst.</p>
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
              <div className="kicker" style={{color:'var(--green)'}}>Speciale wensen?</div>
              <h2>Pakket op maat</h2>
              <p>Stuur een bericht via WhatsApp. Wij maken een voorstel dat precies aansluit op jouw plannen.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Neem contact op
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Drankpakketten op Ibiza</h2>
          <p>Begin je avond zorgeloos met een vooraf geregeld drankpakket. Of je nu met vrienden komt, een verjaardag viert of een vrijgezellenfeest organiseert — wij zorgen dat de drankjes klaarstaan.</p>
          <p>De inhoud en prijzen stellen we samen met jou vast. Neem contact op via WhatsApp en we regelen een pakket dat past bij je groep, datum en budget.</p>
        </div>
      </section>
    </>
  );
}
