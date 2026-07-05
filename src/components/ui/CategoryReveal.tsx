'use client'

import Link from 'next/link'
import React, { useState } from 'react'

type Cat = { href: string; img: string; aria: string; label: React.ReactNode }

export function CategoryReveal({ base, translations = {} }: { base: string; translations?: any }) {
  // null = all closed (text). Otherwise the href of the tile that is opened (photo revealed).
  const [open, setOpen] = useState<string | null>(null)

  const clubsLabel = (translations.home_clubs_venues || 'Clubs & Venues')
    .split(/\s*&\s*|\s+(?:en|and|y|et)\s+/i)
    .filter(Boolean)
    .map((p: string, i: number) => (
      <span key={i} className="block">{p.trim()}</span>
    ))

  const cats: Cat[] = [
    { href: `${base}/calendar`, img: '/icons/cat-kalender.jpg', aria: translations.home_full_calendar || 'Full Calendar', label: translations.home_full_calendar || 'Full Calendar' },
    { href: `${base}/club-tickets`, img: '/icons/cat-club.jpg', aria: translations.home_clubs_venues || 'Clubs & Venues', label: clubsLabel },
    { href: `${base}/private-boat-charters`, img: '/icons/cat-boot.jpg', aria: translations.nav_private_boat || 'Private Boat', label: translations.nav_private_boat || 'Private Boat' },
  ]

  return (
    <div className="creveal-row">
      {cats.map((c) => {
        const isOpen = open === c.href
        return (
          <Link
            key={c.href}
            href={c.href}
            aria-label={c.aria}
            className={`creveal${isOpen ? ' is-open' : ''}`}
            onClick={(e) => {
              // First tap: reveal the photo. Second tap (already open): let the Link navigate.
              if (open !== c.href) {
                e.preventDefault()
                setOpen(c.href)
              }
            }}
          >
            <span className="creveal-circle">
              <img src={c.img} alt="" className="creveal-img" loading="lazy" />
              <span className="creveal-text">{c.label}</span>
              <span className="creveal-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
