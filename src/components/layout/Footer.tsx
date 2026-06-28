'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LOCALES = [
  { code: 'nl' },
  { code: 'en' },
  { code: 'es' },
  { code: 'de' },
  { code: 'fr' },
]

export function Footer({ dict }: { dict?: any }) {
  const pathname = usePathname()
  const currentLocale = LOCALES.find(l => pathname.startsWith(`/${l.code}/`) || pathname === `/${l.code}`) || LOCALES[0]
  const base = `/${currentLocale.code}`

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          
          <div>
            <Link href={base} className="brand">
              <span className="mark">
                <img src="/logo-clean.png" alt="Ibiza mi Vida" className="w-[30px] h-[30px] object-contain invert brightness-0" />
              </span>
              <b>Ibiza mi <span>Vida</span></b>
            </Link>
            <p className="tag">
              {dict?.footer_description || 'Jouw tickets, boten en tips voor het perfecte Ibiza. Eén connectie naar het hele eiland.'}
            </p>
          </div>
          
          <div className="fcol">
            <h4>{dict?.footer_discover || 'Ontdek'}</h4>
            <Link href={`${base}/calendar`}>{dict?.nav_calendar || 'Kalender'}</Link>
            <Link href={`${base}/deals-of-the-day`}>{dict?.nav_deals_of_the_day || 'Deals of the Day'}</Link>
            <Link href={`${base}/clubs`}>{dict?.nav_clubs || 'Clubs Ibiza'}</Link>
            <Link href={`${base}/artists`}>{dict?.nav_artists || 'Artiesten'}</Link>
            <Link href={`${base}/club-tickets`}>{dict?.nav_club_tickets || 'Club Tickets'}</Link>
          </div>
          
          <div className="fcol">
            <h4>{dict?.footer_on_water || 'Op het water'}</h4>
            <Link href={`${base}/boat-parties`}>{dict?.nav_boat_parties || 'Bootfeesten'}</Link>
            <Link href={`${base}/private-boat-charters`}>{dict?.nav_private_boat_charters || 'Private Boat Charters'}</Link>
            <Link href={`${base}/vip-catamaran`}>{dict?.nav_vip_catamaran || 'VIP Catamaran'}</Link>
            <Link href={`${base}/formentera-boat-trips`}>{dict?.nav_formentera_boat_trips || 'Ferry Formentera'}</Link>
          </div>
          
          <div className="fcol">
            <h4>{dict?.footer_more || 'Meer'}</h4>
            <Link href={`${base}/drink-packages`}>{dict?.nav_drink_packages || 'Drink Packages'}</Link>
            <Link href={`${base}/car-scooter-rental`}>{dict?.nav_car_scooter_rental || 'Car & Scooter Rental'}</Link>
            <Link href={`${base}/guestlist`}>{dict?.nav_guestlist || 'Guestlist'}</Link>
            <Link href={`${base}/tips`}>{dict?.nav_tips || 'Ibiza Tips'}</Link>
            <Link href={`${base}/blog`}>{dict?.nav_blog || 'Blog'}</Link>
            <Link href={`${base}/free-discount-ibiza`}>{dict?.nav_free_discount_ibiza || 'Free & Discount'}</Link>
          </div>
          
        </div>
        
        <div className="fbot">
          <span>© {new Date().getFullYear()} Ibiza mi Vida — Powered by ClubTickets API</span>
          <span>
            <Link href={`${base}/privacy-policy`}>{dict?.footer_privacy || 'Privacy'}</Link> · 
            <Link href={`${base}/terms-and-conditions`}> {dict?.footer_terms || 'Voorwaarden'}</Link> · 
            <Link href={`${base}/cookie-policy`}> {dict?.footer_cookie || 'Cookies'}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
