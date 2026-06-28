'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle, Ship, Euro } from 'lucide-react';
import '@/styles/bootfeesten.css'; // Re-using styles

export default function FerryFormenteraClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Ferry Formentera</b>
      </div>

      <section className="boat-hero subhero">
        <div className="waveline">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
            <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="rgba(255,255,255,0.1)"></path>
            <path d="M0 40 Q 360 10 720 40 T 1440 40 V 60 H 0 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="inner">
          <div className="eyebrow"><div className="dot"></div> Ibiza Vervoer</div>
          <h1>Ferry van Ibiza naar Formentera</h1>
          <p className="lead">In ongeveer een half uur naar het paradijselijke Formentera, met zijn turquoise water en witte stranden. Bekijk de afvaarttijden en boek je tickets.</p>
        </div>
      </section>

      <div className="statbar">
        <div className="stat"><div className="k">Overtocht</div><div className="v"><Clock size={18} /> ± 30 min</div></div>
        <div className="stat"><div className="k">Aankomst</div><div className="v"><Ship size={18} /> La Savina</div></div>
        <div className="stat"><div className="k">Vanaf</div><div className="v"><Euro size={18} /> Prijs uit API</div></div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Naar het buureiland</div>
              <h2>Ibiza → Formentera</h2>
            </div>
          </div>
          
          <div className="route">
            <div className="stop"><div className="dot"></div><b>Ibiza</b><small>haven uit API</small></div>
            <div className="leg"></div>
            <div className="stop"><div className="dot" style={{background:'var(--blue)'}}></div><b>~30 min</b><small>overtocht</small></div>
            <div className="leg"></div>
            <div className="stop"><div className="dot"></div><b>Formentera</b><small>La Savina</small></div>
          </div>

          <div className="trip-grid" style={{marginTop:'26px'}}>
            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 1</span><span className="tbadge dur">Ferry</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Ship size={32} />
                    <div>Afvaart uit API</div>
                  </div>
                </div>
              </div>
              <div className="body">
                <h3>Titel laadt uit API</h3>
                <div className="trow"><Clock size={14} /> Vertrektijd uit API</div>
                <div className="trow"><MapPin size={14} /> Vertrekpunt uit API</div>
                <div className="tfoot"><div><small>Vanaf</small><b>—€</b></div><button className="mini">Boek nu</button></div>
              </div>
            </div>
            
            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 2</span><span className="tbadge dur">Ferry</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Ship size={32} />
                    <div>Afvaart uit API</div>
                  </div>
                </div>
              </div>
              <div className="body">
                <h3>Titel laadt uit API</h3>
                <div className="trow"><Clock size={14} /> Vertrektijd uit API</div>
                <div className="trow"><MapPin size={14} /> Vertrekpunt uit API</div>
                <div className="tfoot"><div><small>Vanaf</small><b>—€</b></div><button className="mini">Boek nu</button></div>
              </div>
            </div>

            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 3</span><span className="tbadge dur">Ferry</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Ship size={32} />
                    <div>Afvaart uit API</div>
                  </div>
                </div>
              </div>
              <div className="body">
                <h3>Titel laadt uit API</h3>
                <div className="trow"><Clock size={14} /> Vertrektijd uit API</div>
                <div className="trow"><MapPin size={14} /> Vertrekpunt uit API</div>
                <div className="tfoot"><div><small>Vanaf</small><b>—€</b></div><button className="mini">Boek nu</button></div>
              </div>
            </div>

            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 4</span><span className="tbadge dur">Ferry</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Ship size={32} />
                    <div>Afvaart uit API</div>
                  </div>
                </div>
              </div>
              <div className="body">
                <h3>Titel laadt uit API</h3>
                <div className="trow"><Clock size={14} /> Vertrektijd uit API</div>
                <div className="trow"><MapPin size={14} /> Vertrekpunt uit API</div>
                <div className="tfoot"><div><small>Vanaf</small><b>—€</b></div><button className="mini">Boek nu</button></div>
              </div>
            </div>
          </div>
          
          <div style={{marginTop:'18px'}}>
            <span className="api-note"><span className="pulse"></span>Afvaarttijden laden uit ClubTickets API (JSON)</span>
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
              <div className="kicker" style={{color:'var(--green)'}}>Contact</div>
              <h2>Klaar om te boeken?</h2>
              <p>Stuur een bericht met je wensen en we sturen dezelfde dag nog een voorstel terug.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Neem contact op
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Ferry naar Formentera</h2>
          <p>Formentera is de stille parel naast Ibiza: ongerept, met water dat aan de Cariben doet denken. De ferry brengt je er in een half uur naartoe, meerdere keren per dag vanuit de haven van Ibiza-stad.</p>
          <p>Vergelijk de afvaarttijden en boek vooraf om verzekerd te zijn van een plek, zeker in het hoogseizoen.</p>
        </div>
      </section>

    </>
  );
}
