import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Private Boat Charters Ibiza — Privé boot huren | Ibiza mi Vida',
  description: 'Huur een privé boot op Ibiza: charters met bemanning voor jouw groep. Vraag de opties en prijzen op.',
}

interface Props {
  params: {
    locale: string;
  };
}

export default function PrivateBoatChartersPage({ params }: Props) {
  const stats = [
    { label: 'Vertrek', value: 'Marina Botafoch', icon: <svg viewBox="0 0 24 24"><path d="M3 16h18l-2.5 4.5a1 1 0 0 1-.9.5H6.4a1 1 0 0 1-.9-.5L3 16zM5 16l1.2-5h11.6L19 16M12 11V4l5 3-5 2"/></svg> },
    { label: 'Duur', value: '4–8 uur', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg> },
    { label: 'Vanaf', value: 'Op aanvraag', icon: <svg viewBox="0 0 24 24"><path d="M12 2v20M6 6h9a3 3 0 0 1 0 6H6"/></svg> }
  ];

  const crumbs = [
    { label: 'Home', href: `/${params.locale}` },
    { label: 'Op het water', href: `/${params.locale}/boat-parties` },
    { label: 'Private Charters' }
  ];

  return (
    <>
      <div className="subhero">
        <div 
          className="boat-hero" 
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1544211158-b6df3db0f671?w=1920&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="ph"></div>
          <svg className="waveline" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0 Z" fill="rgba(199,234,227,.4)"/>
          </svg>
          <div className="inner">
            <span className="eyebrow"><span className="dot"></span>Private Boat Charters Ibiza</span>
            <h1>Jouw privé boot op Ibiza</h1>
            <p className="lead">Vaar met je eigen gezelschap naar Formentera of ontdek verborgen baaien. Inclusief schipper en drankjes. Vraag vrijblijvend aan.</p>
          </div>
        </div>
        
        <div className="statbar">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="k">{s.label}</div>
              <div className="v">{s.icon}{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="crumb mb-8">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>}
              {c.href ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Private boat charters op Ibiza</h2>
          <p>Niets is zo Ibiza als je eigen boot voor de dag. Een privé charter geeft je de vrijheid om te varen waarheen je wilt, te zwemmen waar je wilt en te vieren met precies het gezelschap dat je kiest.</p>
          <p>De boten, foto's en prijzen voegen wij toe via losse informatiebladen (PDF). Neem contact op via WhatsApp en we sturen je de passende opties.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Helemaal van jou</div>
              <h2>Charter-opties</h2>
            </div>
          </div>

          <div className="pdf-card">
            <div className="ic">
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Boten & Prijzen</h3>
            <p>Elke groep is anders, daarom leveren wij charter opties via maatwerk PDF's. Stuur ons een WhatsApp met je wensen (datum, groepsgrootte, budget) en ontvang direct de beste boten van dit moment.</p>
            <a href="https://wa.me/34641262071" target="_blank" rel="noreferrer" className="btn-primary">
              <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              App ons voor boten
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Veelgestelde vragen</div>
              <h2>Goed om te weten</h2>
            </div>
          </div>
          <div className="faq">
            <details open>
              <summary>Komt er een schipper mee?<span className="pm"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></summary>
              <div className="ans">Ja, charters worden geleverd met ervaren bemanning, tenzij anders afgesproken.</div>
            </details>
            <details>
              <summary>Kan ik de route zelf bepalen?<span className="pm"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></summary>
              <div className="ans">Zeker — een privé charter draait om jouw wensen. Wij denken mee over de mooiste route.</div>
            </details>
            <details>
              <summary>Hoe krijg ik de boot-informatie?<span className="pm"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></summary>
              <div className="ans">We sturen je de specificaties en prijzen als PDF zodra je je wensen hebt doorgegeven.</div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
