'use client'

import { useMemo, useState } from 'react'
import { Sun, Moon, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react'
import type { ScreenProps } from '../MobileApp'
import type { AppVenue } from '../types'
import { optImg } from '@/lib/img'
import { waLink, WA_GUESTLIST } from '../config'

/**
 * Guestlist tab: how-it-works accordion, then day/night club cards. A card tap
 * opens the venue sheet (see the agenda); the per-card WhatsApp button is the
 * actual guestlist action, prefilled with the club name.
 */
export function GuestlistScreen({ venues, t, openVenue }: ScreenProps) {
  const [openHow, setOpenHow] = useState(false)

  const clubs = useMemo(() => venues.filter(v => v.typeSlug === 'clubbing'), [venues])
  const dayClubs = clubs.filter(v => v.isDayClub)
  const nightClubs = clubs.filter(v => !v.isDayClub)

  const gl = (name: string) =>
    waLink(WA_GUESTLIST, `Hi Simon! Guestlist please — club: ${name}. Name + group size: `)

  const Section = ({ title, icon, list }: { title: string; icon: React.ReactNode; list: AppVenue[] }) =>
    list.length === 0 ? null : (
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-black text-white">
          {icon} {title}
        </h2>
        <div className="flex flex-col gap-4">
          {list.map(v => {
            // `cover` is the real photo; `picture`/`whitelogo` are white-on-
            // transparent logo assets — on the white panel those need to be
            // forced black or they're invisible.
            const photo = v.cover
            const logo = v.whitelogo || v.picture
            return (
              <div key={v.slug} className="overflow-hidden rounded-3xl border border-white/[0.07] bg-obsidian-card">
                {/* Logo / photo panel — tap for venue detail */}
                <button
                  type="button"
                  onClick={() => openVenue(v)}
                  aria-label={v.name}
                  className="group relative block h-36 w-full overflow-hidden bg-white outline-none transition-opacity motion-reduce:transition-none hover:opacity-95 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                >
                  {photo ? (
                    <img
                      src={optImg(photo, 640)}
                      loading="lazy"
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                    />
                  ) : logo ? (
                    <img
                      src={optImg(logo, 640)}
                      loading="lazy"
                      alt=""
                      className="h-full w-full object-contain p-8 brightness-0 transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center font-display text-3xl font-black text-obsidian">
                      {v.name}
                    </span>
                  )}
                </button>
                {/* Action row */}
                <div className="flex items-center gap-3 p-3.5">
                  <button
                    type="button"
                    onClick={() => openVenue(v)}
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl px-1.5 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-gold-soft"
                  >
                    <span className="truncate font-display text-[17px] font-extrabold text-white">{v.name}</span>
                    <ChevronRight size={16} className="shrink-0 text-white/30" />
                  </button>
                  <a
                    href={gl(v.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-95 motion-reduce:active:scale-100"
                  >
                    <MessageCircle size={14} /> {t.tabGuestlist}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )

  return (
    <div className="flex flex-col gap-6 px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}>
      <h1 className="text-center font-display text-2xl font-black text-white">{t.guestlistTitle}</h1>

      {/* How it works */}
      <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-obsidian-card">
        <button
          type="button"
          onClick={() => setOpenHow(o => !o)}
          aria-expanded={openHow}
          className="flex w-full items-center justify-between gap-3 p-4.5 px-5 py-4 text-left outline-none transition-colors motion-reduce:transition-none hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-soft"
        >
          <span className="font-display text-[16px] font-extrabold text-white">{t.howItWorks}</span>
          <ChevronDown size={17} className={`shrink-0 text-white/40 transition-transform motion-reduce:transition-none ${openHow ? 'rotate-180' : ''}`} />
        </button>
        {openHow && (
          <div className="border-t border-white/[0.06] px-5 py-4">
            <p className="text-[14px] leading-relaxed text-white/65">{t.howItWorksBody}</p>
            <a
              href={waLink(WA_GUESTLIST, 'Hi Simon! Guestlist please — club: ')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
            >
              <MessageCircle size={15} /> {t.joinGuestlist}
            </a>
          </div>
        )}
      </div>

      <Section title={t.dayClubs} icon={<Sun size={18} className="text-gold-soft" />} list={dayClubs} />
      <Section title={t.nightClubs} icon={<Moon size={18} className="text-gold-soft" />} list={nightClubs} />
    </div>
  )
}
