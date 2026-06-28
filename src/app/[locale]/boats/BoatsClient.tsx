'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Anchor, Navigation, Waves, Users, Ship, ArrowRight, MessageCircle } from 'lucide-react';
import '@/styles/boats.css';

export default function BoatsClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Boten &amp; Ferry's</b>
      </div>

      <section className="boat-hero">
        <div className="waveline">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
            <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="rgba(255,255,255,0.1)"></path>
            <path d="M0 40 Q 360 10 720 40 T 1440 40 V 60 H 0 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="inner">
          <div className="eyebrow"><div className="dot"></div> Alles op het water</div>
          <h1>Ibiza per Boot</h1>
          <p className="lead">Van all-inclusive boat parties tot het huren van een privé jacht. Jouw ultieme dag op het water begint hier.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="hubgrid">
            
            <Link href="/bootfeesten" className="hubcard in">
              <div className="media">
                <div className="bigicon"><Anchor size={24} /></div>
                <div className="mtag">4 Opties</div>
              </div>
              <div className="body">
                <h3>Bootfeesten (Boat Parties)</h3>
                <p>De legendarische feesten op zee. Met top dj's, open bar en honderden party-gangers langs de kust van Ibiza.</p>
                <span className="go">Ontdekken <ArrowRight size={17} /></span>
              </div>
            </Link>

            <Link href="/boat-trip" className="hubcard in">
              <div className="media">
                <div className="bigicon"><Navigation size={24} /></div>
                <div className="mtag">8 Opties</div>
              </div>
              <div className="body">
                <h3>Boat Trips &amp; Excursies</h3>
                <p>Ontspannen varen naar verborgen baaien. Inclusief zwemstops, snorkelen en vaak een verzorgde paella-lunch.</p>
                <span className="go">Bekijken <ArrowRight size={17} /></span>
              </div>
            </Link>

            <Link href="/boat-charters" className="hubcard in">
              <div className="media">
                <div className="bigicon"><Users size={24} /></div>
                <div className="mtag">Privé</div>
              </div>
              <div className="body">
                <h3>Privé Boat Charters</h3>
                <p>Huur een complete boot met schipper voor jouw eigen groep. Vanaf betaalbare sloepen tot luxe jachten.</p>
                <span className="go">Aanvragen <ArrowRight size={17} /></span>
              </div>
            </Link>

            <Link href="/shuttle-ferry" className="hubcard in">
              <div className="media">
                <div className="bigicon"><Waves size={24} /></div>
                <div className="mtag">Vanaf €8</div>
              </div>
              <div className="body">
                <h3>Shuttle Ferry's (Ibiza)</h3>
                <p>Goedkope en leuke watertaxi's die je snel naar de populaire stranden op Ibiza zelf brengen (bijv. Cala Bassa).</p>
                <span className="go">Tickets <ArrowRight size={17} /></span>
              </div>
            </Link>

            <Link href="/ferry-formentera" className="hubcard in">
              <div className="media">
                <div className="bigicon"><Ship size={24} /></div>
                <div className="mtag">Vanaf €25</div>
              </div>
              <div className="body">
                <h3>Ferry Ibiza – Formentera</h3>
                <p>In ± 30 minuten naar het paradijselijke Formentera en zijn turquoise stranden.</p>
                <span className="go">Bekijken <ArrowRight size={17} /></span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="wa-band">
            <svg className="wave-deco" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0 50 Q 25 25 50 50 T 100 50 V 100 H 0 Z" />
            </svg>
            <div>
              <div className="kicker" style={{color:'var(--green)'}}>Niet zeker welke?</div>
              <h2>Wij helpen je kiezen</h2>
              <p>Vertel ons je groep en wensen via WhatsApp — we adviseren de beste optie op het water.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Chat met ons
            </a>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap intro-seo">
          <h2>Ibiza beleven vanaf het water</h2>
          <p>Het water is de mooiste kant van Ibiza. Of je nu wilt feesten op een varende dansvloer, in alle rust de verborgen baaien wilt ontdekken, je eigen boot wilt huren of snel naar Formentera wilt — alle opties vind je hier overzichtelijk bij elkaar.</p>
          <p>Kies een categorie om het actuele aanbod, de tijden en de prijzen te bekijken. Voor groepen of privé-arrangementen helpen we je graag persoonlijk via WhatsApp.</p>
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
              <summary>
                Wat is het verschil tussen een boat party en een boat trip?
                <span className="pm">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" fill="none" strokeWidth="2.4"/></svg>
                </span>
              </summary>
              <div className="ans">Een boat party draait om feesten met dj's en drank, vaak 's middags of bij zonsondergang. Een boat trip is rustiger en gericht op de mooiste plekken langs de kust.</div>
            </details>
            <details>
              <summary>
                Hoe boek ik een privé boot?
                <span className="pm">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" fill="none" strokeWidth="2.4"/></svg>
                </span>
              </summary>
              <div className="ans">Open Private Boat Charters en neem contact op via WhatsApp. We sturen je passende boten met info en prijzen.</div>
            </details>
            <details>
              <summary>
                Welke optie is het snelst naar Formentera?
                <span className="pm">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" fill="none" strokeWidth="2.4"/></svg>
                </span>
              </summary>
              <div className="ans">De Ferry Ibiza – Formentera brengt je in ongeveer 30 tot 45 minuten van Ibiza-Stad naar de haven van Formentera (La Savina).</div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
