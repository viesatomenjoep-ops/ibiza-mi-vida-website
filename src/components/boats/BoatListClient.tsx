'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface Crumb {
  label: string;
  href?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface TripCardProps {
  id: string;
  title: string;
  coverImage: string;
  departureTime?: string;
  departureLocation?: string;
  price?: string;
  badges?: string[];
  slug?: string;
  basePath?: string;
}

interface BoatListClientProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  coverImage?: string;
  crumbs: Crumb[];
  stats?: Stat[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  events: TripCardProps[];
  children?: React.ReactNode;
}

export const BoatListClient: React.FC<BoatListClientProps> = ({
  eyebrow,
  title,
  subtitle,
  coverImage,
  crumbs,
  stats,
  sectionTitle = "Aankomende trips",
  sectionSubtitle = "Bekijk het actuele aanbod en boek direct.",
  events,
  children
}) => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Hero */}
      <div className="boat-hero" style={coverImage ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        {!coverImage && <div className="ph">Cover-foto laadt uit API</div>}
        <svg className="waveline" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 V60 H0 Z" fill="rgba(199,234,227,.4)" />
        </svg>
        <div className="inner">
          <span className="eyebrow"><span className="dot"></span>{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
        </div>
      </div>

      {/* Back navigation */}
      <div className="wrap" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {crumbs.length > 1 && crumbs[crumbs.length - 2]?.href && (
          <Link
            href={crumbs[crumbs.length - 2].href!}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity pt-4 pb-0"
            style={{ color: 'inherit' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6"/></svg>
            {crumbs[crumbs.length - 2].label}
          </Link>
        )}
      </div>

      {/* Statbar */}
      {stats && stats.length > 0 && (
        <div className="statbar">
          {stats.map((stat, i) => (
            <div className="stat" key={i}>
              <div className="k">{stat.label}</div>
              <div className="v">
                {stat.icon}
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid Section */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="l">
              <div className="kicker">{eyebrow}</div>
              <h2>{sectionTitle}</h2>
              <p>{sectionSubtitle}</p>
            </div>
          </div>
          
          {children}

          <div className="trip-grid">
            {events.map((ev) => (
              <div className="tripcard" key={ev.id}>
                <div className="media">
                  {ev.badges?.map((badge, i) => (
                    <span key={i} className={`tbadge ${i === 1 ? 'dur' : ''}`}>{badge}</span>
                  ))}
                  {ev.coverImage ? (
                    <Image 
                      src={ev.coverImage} 
                      alt={ev.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="ph">
                      <div style={{ textAlign: 'center' }}>
                        <svg viewBox="0 0 24 24"><path d="M3 16h18l-2 5H5zM5 16l1-5h12l1 5M9 11V6" /></svg>
                        <div>Foto laadt uit API</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="body">
                  <h3>{ev.title}</h3>
                  {ev.departureTime && (
                    <div className="trow">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>
                      {ev.departureTime}
                    </div>
                  )}
                  {ev.departureLocation && (
                    <div className="trow">
                      <svg viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /></svg>
                      {ev.departureLocation}
                    </div>
                  )}
                  <div className="tfoot">
                    <div><small>Vanaf</small><b>{ev.price || '—€'}</b></div>
                    <Link href={`/${ev.basePath || 'boat-parties'}/${ev.slug}`}>
                      <button className="mini">Boek nu</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
