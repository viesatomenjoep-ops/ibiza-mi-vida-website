'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle, FileText, Music, Globe, ArrowRight } from 'lucide-react';
import '@/styles/club-tickets.css'; // Re-use styling

export default function BlogClient({ dict }: { dict?: any }) {
  return (
    <>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <b>Blog</b>
      </div>

      <section className="boat-hero subhero" style={{ background: 'transparent' }}>
        <div className="subhero-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(70% 90% at 0% 0%, var(--mint), transparent 55%), radial-gradient(70% 90% at 100% 0%, rgba(140,191,212,.45), transparent 50%), var(--cotton)' }}></div>
        <div className="inner">
          <div className="eyebrow" style={{ background: 'var(--sage)', color: 'var(--cotton)' }}><div className="dot" style={{ background: 'var(--green)' }}></div> Nieuws & Updates</div>
          <h1 style={{ color: 'var(--sage)' }}>De Ibiza <span className="accent" style={{ color: 'var(--blue)' }}>blog</span></h1>
          <p className="lead" style={{ color: 'var(--sage-80)' }}>Nieuws over clubs, actuele line-ups en handige info voor je trip. Alles wat je moet weten voordat je naar het eiland komt.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">Laatste artikelen</div>
              <h2>Nieuws & tips</h2>
            </div>
          </div>
          
          <div className="media-grid">
            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Gids</span>
                <FileText size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>Hoe overleef je het openingsweekend?</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees artikel
                </div>
              </div>
            </div>

            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Line-up</span>
                <Music size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>Ushuaïa maakt eerste namen bekend</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees artikel
                </div>
              </div>
            </div>

            <div className="mcard in">
              <div className="mthumb">
                <span className="mtag">Reisinfo</span>
                <Globe size={32} style={{ stroke: 'rgba(44,74,66,.45)' }} />
              </div>
              <div className="mbody">
                <h3>Nieuwe regels autohuur op de luchthaven</h3>
                <div className="ph-line"></div>
                <div className="ph-line s"></div>
                <div className="mmeta">
                  <ArrowRight size={13} /> Lees artikel
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <span className="api-note"><span className="pulse"></span>Meer nieuws volgt snel</span>
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
              <div className="kicker" style={{color:'var(--green)'}}>Vraag het ons</div>
              <h2>Vragen over een artikel?</h2>
              <p>Stuur ons een bericht via WhatsApp en we geven je graag de laatste actuele informatie.</p>
            </div>
            <a className="wa-big" href="https://wa.me/31612345678" target="_blank" rel="noreferrer">
              <MessageCircle size={22} fill="var(--sage)" stroke="none" /> WhatsApp ons
            </a>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="wrap intro-seo">
          <h2>De Ibiza mi Vida blog</h2>
          <p>Op onze blog lees je alles over het eiland: van line-up aankondigingen en festivalgidsen tot praktische reistips. Zo ben je altijd op de hoogte van wat er speelt op Ibiza.</p>
          <p>Heb je een vraag naar aanleiding van een artikel? Neem contact op via WhatsApp, we helpen je graag verder.</p>
        </div>
      </section>
    </>
  );
}
