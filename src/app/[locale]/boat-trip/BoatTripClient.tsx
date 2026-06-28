'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle, Anchor, Waves } from 'lucide-react';
import '@/styles/bootfeesten.css'; // Re-use bootfeesten.css as it has the same layout

export default function BoatTripClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Boat Trips</b>
      </div>

      <section className="boat-hero subhero">
        <div className="waveline">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
            <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="rgba(255,255,255,0.1)"></path>
            <path d="M0 40 Q 360 10 720 40 T 1440 40 V 60 H 0 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="inner">
          <div className="eyebrow"><div className="dot"></div> Boat Trip Ibiza</div>
          <h1>Boottochten langs de mooiste baaien</h1>
          <p className="lead">Verken verborgen baaien, grotten en het iconische Es Vedrà. Rustige dagtochten voor wie de kust vanaf het water wil zien.</p>
        </div>
      </section>

      <div className="statbar">
        <div className="stat"><div className="k">Vertrek</div><div className="v">Diverse havens</div></div>
        <div className="stat"><div className="k">Duur</div><div className="v">Halve / hele dag</div></div>
        <div className="stat"><div className="k">Type</div><div className="v">Relaxed</div></div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Het complete pakket</div>
              <h2>Boat trip tickets</h2>
            </div>
          </div>
          
          <div className="trip-grid">
            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 1</span><span className="tbadge dur">Trip</span>
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
                <span className="tbadge">Trip 2</span><span className="tbadge dur">Trip</span>
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
                <span className="tbadge">Trip 3</span><span className="tbadge dur">Trip</span>
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
                <span className="tbadge">Trip 4</span><span className="tbadge dur">Trip</span>
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
                <span className="tbadge">Trip 5</span><span className="tbadge dur">Trip</span>
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
                <span className="tbadge">Trip 6</span><span className="tbadge dur">Trip</span>
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
            <span className="api-note"><span className="pulse"></span>Boat trips laden uit ClubTickets API (JSON)</span>
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
              <div className="kicker" style={{color:'var(--green)'}}>Hulp nodig?</div>
              <h2>Vragen over deze trip?</h2>
              <p>Ons team helpt je via WhatsApp met groepen, tijden en privé-opties.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Chat met ons
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>Boottochten op Ibiza</h2>
          <p>Ibiza is het mooist vanaf het water. Een boottocht brengt je langs baaien die je over land niet bereikt, langs grillige kliffen en naar het mystieke eilandje Es Vedrà. Perfect voor een rustige dag op zee.</p>
          <p>Kies een halve of hele dag, met of zonder lunch, en boek eenvoudig je plek.</p>
        </div>
      </section>

    </>
  );
}
