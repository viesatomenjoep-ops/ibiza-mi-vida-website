'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle } from 'lucide-react';
import '@/styles/bootfeesten.css';

export default function BootfeestenClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <Link href="/boats">Boten &amp; Ferry's</Link>
        <ChevronRight size={13} />
        <b>Bootfeesten</b>
      </div>

      <section className="boat-hero subhero">
        <div className="waveline">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
            <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="rgba(255,255,255,0.1)"></path>
            <path d="M0 40 Q 360 10 720 40 T 1440 40 V 60 H 0 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="inner">
          <div className="eyebrow"><div className="dot"></div> Party Boats</div>
          <h1>Bootfeesten Ibiza</h1>
          <p className="lead">De beste boat parties van Ibiza. Vaar langs de kust met honderden feestgangers, dj's en open bar.</p>
        </div>
      </section>

      <div className="statbar">
        <div className="stat"><div className="k">Populairste</div><div className="v">Pukka Up</div></div>
        <div className="stat"><div className="k">Inclusief</div><div className="v">Open Bar / Drinks</div></div>
        <div className="stat"><div className="k">Vertrek</div><div className="v">San Antonio / PdB</div></div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Actueel Aanbod</div>
              <h2>Vergelijk Boat Parties</h2>
            </div>
          </div>
          
          <div className="trip-grid">
            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 1</span><span className="tbadge dur">Day</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Calendar size={32} />
                    <div>Foto laadt uit API</div>
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
                <span className="tbadge">Trip 2</span><span className="tbadge dur">Sunset</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Calendar size={32} />
                    <div>Foto laadt uit API</div>
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
                <span className="tbadge">Trip 3</span><span className="tbadge dur">Day</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Calendar size={32} />
                    <div>Foto laadt uit API</div>
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
                <span className="tbadge">Trip 4</span><span className="tbadge dur">Night</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Calendar size={32} />
                    <div>Foto laadt uit API</div>
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
                <span className="tbadge">Trip 5</span><span className="tbadge dur">Night</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Calendar size={32} />
                    <div>Foto laadt uit API</div>
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
                <span className="tbadge">Trip 6</span><span className="tbadge dur">Night</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <Calendar size={32} />
                    <div>Foto laadt uit API</div>
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
            <span className="api-note"><span className="pulse"></span>Bootfeesten laden uit ClubTickets API (JSON)</span>
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
              <div className="kicker" style={{color:'var(--green)'}}>Grote groep?</div>
              <h2>Groepskorting of VIP</h2>
              <p>Ga je met een grote groep, vrijgezellenfeest of wil je een VIP-bed op de boot? Stuur ons een berichtje voor de mogelijkheden.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Chat met ons
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Hoe kies je het beste bootfeest?</h2>
          <p>Bootfeesten zijn al jaren een begrip op Ibiza. Je stapt aan boord van een grote catamaran, de dj begint te draaien en terwijl je de haven uitvaart, barst het feest los. Bij de meeste boat parties is een open bar (of meerdere gratis drankjes) inbegrepen. Halverwege is er vaak een zwemstop om even af te koelen in de zee.</p>
          <p><strong>San Antonio vs. Playa d'en Bossa</strong><br/>
          De meeste bootfeesten vertrekken vanuit San Antonio (zoals de bekende Pukka Up) en richten zich op de zonsondergang. Enkele vertrekken vanuit Playa d'en Bossa (zoals Oceanbeat) en varen richting Formentera. Check goed je vertreklocatie zodat je niet onnodig het hele eiland over hoeft te reizen.</p>
        </div>
      </section>

    </>
  );
}
