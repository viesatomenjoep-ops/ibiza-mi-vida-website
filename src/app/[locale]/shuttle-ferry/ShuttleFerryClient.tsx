'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle, Navigation } from 'lucide-react';
import '@/styles/bootfeesten.css'; // Re-using styles

export default function ShuttleFerryClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Shuttle Ferry</b>
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
          <h1>Snelle shuttle ferry overtochten</h1>
          <p className="lead">De handigste manier om langs de kust te reizen — snelle shuttles tussen stranden, clubs en havens. Bekijk de tijden en boek vooraf.</p>
        </div>
      </section>

      <div className="statbar">
        <div className="stat"><div className="k">Type</div><div className="v">Shuttle</div></div>
        <div className="stat"><div className="k">Frequentie</div><div className="v">Meerdere p/dag</div></div>
        <div className="stat"><div className="k">Vanaf</div><div className="v">Prijs uit API</div></div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Snel van A naar B</div>
              <h2>Shuttle-routes</h2>
            </div>
          </div>
          
          <div className="route">
            <div className="stop"><div className="dot"></div><b>Vertrekpunt</b><small>uit API</small></div>
            <div className="leg"></div>
            <div className="stop"><div className="dot"></div><b>Bestemming</b><small>uit API</small></div>
          </div>

          <div className="trip-grid" style={{marginTop:'26px'}}>
            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 1</span><span className="tbadge dur">Shuttle</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Navigation size={32} />
                    <div>Route uit API</div>
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
                <span className="tbadge">Trip 2</span><span className="tbadge dur">Shuttle</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Navigation size={32} />
                    <div>Route uit API</div>
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
                <span className="tbadge">Trip 3</span><span className="tbadge dur">Shuttle</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Navigation size={32} />
                    <div>Route uit API</div>
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
                <span className="tbadge">Trip 4</span><span className="tbadge dur">Shuttle</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Navigation size={32} />
                    <div>Route uit API</div>
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
            <span className="api-note"><span className="pulse"></span>Shuttle-tijden laden uit ClubTickets API (JSON)</span>
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
          <h2>Shuttle ferry op Ibiza</h2>
          <p>Files en parkeerstress voorkom je met de shuttle ferry. Snelle overtochten verbinden de stranden, clubs en havens van Ibiza, zodat je ontspannen op je bestemming aankomt.</p>
          <p>Bekijk de routes en tijden en boek je overtocht vooraf, zeker in de drukke zomermaanden.</p>
        </div>
      </section>

    </>
  );
}
