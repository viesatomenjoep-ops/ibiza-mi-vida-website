'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Users, MapPin, Clock, MessageCircle, FileText, Info } from 'lucide-react';
import '@/styles/bootfeesten.css'; // Re-using styles

export default function BoatChartersClient({ dict }: { dict?: any }) {
  return (
    <>
      

      <section className="boat-hero subhero">
        <div className="waveline">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
            <path d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z" fill="rgba(255,255,255,0.1)"></path>
            <path d="M0 40 Q 360 10 720 40 T 1440 40 V 60 H 0 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="inner">
          <div className="eyebrow"><div className="dot"></div> Ibiza Charters</div>
          <h1>Privé boot charters op Ibiza</h1>
          <p className="lead">Jouw eigen boot voor de dag — met bemanning, jouw route en jouw gezelschap. Ideaal voor groepen, vieringen of een dag luxe op zee.</p>
        </div>
      </section>

      <div className="statbar">
        <div className="stat"><div className="k">Type</div><div className="v">Privé charter</div></div>
        <div className="stat"><div className="k">Groep</div><div className="v">Op aanvraag</div></div>
        <div className="stat"><div className="k">Info</div><div className="v">Via PDF</div></div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Helemaal van jou</div>
              <h2>Charter-opties</h2>
              <p>Voorbeeldindeling — de boten en details voegen wij toe via PDF-informatie.</p>
            </div>
          </div>
          
          <div className="trip-grid">
            <div className="tripcard in">
              <div className="media">
                <span className="tbadge">Trip 1</span><span className="tbadge dur">Privé</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <MapPin size={32} />
                    <div>Foto via PDF-info</div>
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
                <span className="tbadge">Trip 2</span><span className="tbadge dur">Privé</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <MapPin size={32} />
                    <div>Foto via PDF-info</div>
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
                <span className="tbadge">Trip 3</span><span className="tbadge dur">Privé</span>
                <div className="ph">
                  <div style={{textAlign:'center'}}>
                    <MapPin size={32} />
                    <div>Foto via PDF-info</div>
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
          
          <div style={{marginTop:'26px'}}>
            <div className="pdf-card">
              <div className="ic">
                <FileText size={30} fill="none" />
              </div>
              <h3>Boot-informatie volgt</h3>
              <p>De specificaties, foto's en prijzen van elke charter voegen wij later toe via losse PDF-bestanden. Voor nu kun je direct contact opnemen voor de mogelijkheden.</p>
              <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
                <MessageCircle size={22} fill="var(--sage)" stroke="none" /> Vraag de opties op
              </a>
            </div>
          </div>

        </div>
      </section>

      <section className="block alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Zo werkt het</div>
              <h2>Een charter regelen</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step"><div className="num">1</div><h3>Vertel je wensen</h3><p>Aantal personen, datum en wat voor dag je voor ogen hebt.</p></div>
            <div className="step"><div className="num">2</div><h3>Wij sturen opties</h3><p>Je ontvangt passende boten met info en prijzen (PDF).</p></div>
            <div className="step"><div className="num">3</div><h3>Bevestig &amp; vaar uit</h3><p>Na bevestiging regelen wij de rest tot aan de afvaart.</p></div>
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
          <h2>Private boat charters op Ibiza</h2>
          <p>Niets is zo Ibiza als je eigen boot voor de dag. Een privé charter geeft je de vrijheid om te varen waarheen je wilt, te zwemmen waar je wilt en te vieren met precies het gezelschap dat je kiest.</p>
          <p>De boten, foto's en prijzen voegen wij toe via losse informatiebladen (PDF). Neem contact op via WhatsApp en we sturen je de passende opties.</p>
        </div>
      </section>

    </>
  );
}
