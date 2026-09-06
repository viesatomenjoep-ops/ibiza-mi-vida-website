'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { ClubLogoSlider } from '@/components/ui/ClubLogoSlider';
import type { PickerEvent } from '@/lib/picker-event';
import { type DealsData } from '@/components/home/HomeDeals';
import { HomeEventSlider } from '@/components/ui/HomeEventSlider';
import { HomeHeroVideo } from '@/components/home/HomeHeroVideo';
import { HeroShowIntro } from '@/components/home/HeroShowIntro';
import { HomeCategoryCarousel } from '@/components/home/HomeCategoryCarousel';
import { HomeUSP } from '@/components/home/HomeUSP';
import { HomeInstagram } from '@/components/home/HomeInstagram';
import { HomeNewsletter } from '@/components/home/HomeNewsletter';
import { HomeRingCarousel } from '@/components/home/HomeRingCarousel';
import { HomeTonight } from '@/components/home/HomeTonight';
import { HeroRatingBadge, type HeroRating } from '@/components/home/HeroRatingBadge';
import { HomeVimeo } from '@/components/home/HomeVimeo'
import { HomeEventsTickets } from '@/components/home/HomeEventsTickets'
import { HomeActivities } from '@/components/home/HomeActivities'
import { HomeBoats } from '@/components/home/HomeBoats'

import { Reveal } from '@/components/ui/Reveal';
// Category-grid labels for the boat pages. These live here rather than in the
// shared dictionaries because the dictionaries have no keys for them yet and
// adding three keys x 5 locale JSON files for one grid is more churn than it
// is worth.
const CAT_BOATS: Record<string, string> = {
  nl: 'Ibiza per boot', en: 'Ibiza by boat', de: 'Ibiza per Boot', es: 'Ibiza en barco', fr: 'Ibiza en bateau',
}

const CAT_BOAT_PARTY: Record<string, string> = {
  nl: 'Boat parties', en: 'Boat parties', de: 'Boat Partys', es: 'Boat parties', fr: 'Boat parties',
}
const CAT_CHARTER: Record<string, string> = {
  nl: 'Privéboot huren', en: 'Private boat charter', de: 'Privatboot mieten', es: 'Barco privado', fr: 'Bateau privé',
}

interface HomePageProps {
  /**
   * Server-gerenderde verhuursectie, als slot doorgegeven.
   *
   * Deze component is een client component, maar de verhuurblokken hoeven
   * dat niet te zijn — en mogen het niet zijn: het zijn commerciële links
   * die een crawler zonder JavaScript moet kunnen lezen. React staat toe
   * een server component als prop door te geven aan een client component,
   * dus dat gebeurt hier, in plaats van het blok onderaan de pagina buiten
   * deze component te hangen waar niemand het ziet.
   */
  rentalsSlot?: React.ReactNode;
  /**
   * De echte Google-reviews, server-gerenderd (GoogleReviews + ReviewSchema).
   * Een slot en geen import: GoogleReviews is een async server-component en
   * dit bestand is een client-component. Rendert niets zolang het
   * Bedrijfsprofiel niet gekoppeld is — dat is de bedoeling, geen fout.
   */
  reviewsSlot?: React.ReactNode;
  /** Server-gerenderde FAQ: als import stond hij mét 127 kB faq-content in de clientbundle. */
  faqSlot?: React.ReactNode;
  locale?: string;
  translations?: any;
  featuredClubs?: any[];
  clubDays?: { date: string; items: any[] }[];
  /** Non-club events happening soon: boats, ferries, catamarans, activities. */
  experienceDays?: { date: string; items: any[] }[];
  pickerEvents?: PickerEvent[];
  deals?: DealsData;
  allVenues?: any[]; // includes typeSlug: 'clubbing' | 'boat' | ...
  liveByClub?: Record<string, { today: { name: string; slug?: string }[]; lastNight: { name: string; slug?: string }[]; isDayClub: boolean }>;
  /** Server-rendered ISO yyyy-mm-dd, so date labels are hydration-safe. */
  todayStr?: string;
  /** Live Google rating, or null when the profile has none to show. */
  rating?: HeroRating | null;
}

/**
 * De vier werelden van de site, als teksten.
 *
 * Dezelfde vier namen als het hoofdmenu en de ringcarrousel: wie het menu
 * kent, kent de homepage. De kleuren zijn pasteltinten van het eigen palet
 * (roze --spring, het groen, het goud, obsidian) -- geen nieuwe kleuren, wel
 * een lichte huid ervan, zodat vier zones naast elkaar familie blijven.
 */
const ZONES: { id: string; kleurKlasse: string; stip: string; naam: Record<string, string> }[] = [
  { id: 'zone-events', kleurKlasse: 'zone--events', stip: '#E14D68', naam: { nl: 'Events & Tickets', en: 'Events & Tickets', de: 'Events & Tickets', es: 'Eventos y entradas', fr: 'Événements & billets' } },
  { id: 'zone-water', kleurKlasse: 'zone--water', stip: '#0E7C66', naam: { nl: 'On the Water', en: 'On the Water', de: 'On the Water', es: 'On the Water', fr: 'On the Water' } },
  { id: 'zone-island', kleurKlasse: 'zone--island', stip: '#C8A24A', naam: { nl: 'On the land activities', en: 'On the land activities', de: 'On the land activities', es: 'On the land activities', fr: 'On the land activities' } },
  { id: 'zone-insider', kleurKlasse: 'zone--insider', stip: '#8D7BC4', naam: { nl: 'Insider', en: 'Insider', de: 'Insider', es: 'Insider', fr: 'Insider' } },
]

export default function HomePageClient({ locale = 'nl', translations = {}, featuredClubs = [], clubDays = [], experienceDays = [], pickerEvents = [], deals, allVenues = [], liveByClub = {}, todayStr = '', rating = null, rentalsSlot = null, reviewsSlot = null, faqSlot = null }: HomePageProps) {
  const base = `/${locale}`;
  const router = useRouter();

  const clubLogos = useMemo(() => {
    const clubs = allVenues.filter(v => v.typeSlug === 'clubbing');
    // Shuffle deterministically so columns look varied
    return clubs.length > 0 ? clubs : allVenues;
  }, [allVenues]);


  // Column config: 4 columns (was 10 — reduces image requests from 300→~60)
  const LIFT_COLS = 4;
  const liftCols = useMemo(() => {
    return Array.from({ length: LIFT_COLS }, (_, i) => ({
      id: i,
      duration: 32 + i * 5,
      reverse: i % 2 === 1,
      delay: -(i * 6),
    }));
  }, []);

  return (
    <div className="theme-monaco-vip is-home bg-white text-[var(--color-ink)] min-h-screen">

      {/* ── HERO — the video fills the whole first screen (behind the navbar, down to
          the dock), object-cover so it's completely filling. ── */}
      <header className="relative w-full overflow-hidden bg-black text-white" style={{ height: '100svh' }}>
        <HomeHeroVideo
          style={{ objectPosition: 'center', filter: 'brightness(0.62) contrast(1.5) saturate(1.05)' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/70" />
        {/* Extra dark band under the navbar so the brand, partner strip and
            hamburger stay white and readable over any bright video frame */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] bg-gradient-to-b from-black/70 to-transparent" style={{ height: 'calc(var(--nav-h) + 40px)' }} />

        {/* Animated show-intro over the video — three lines type in on a loop */}
        {/* paddingBottom duwt de kop en de knoppen omhoog om ruimte te laten
            voor de live-strook onderaan. Op een telefoon was dat te veel: de
            tekst plakte tegen de navigatiebalk en er viel een gat onder de
            knoppen. Daar dus minder wegduwen, plus wat extra ruimte bovenin
            zodat het blok als geheel iets zakt. De strook zelf staat los
            onderaan en beweegt niet mee. */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pt-[10vh] text-center md:pt-0" style={{ paddingBottom: 'var(--hero-bottom, 14vh)' }}>
          <HeroShowIntro locale={locale} />
          <Link
            href={`${base}/calendar`}
            className="pointer-events-auto mt-10 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gold/10 px-8 py-3.5 font-serif text-xs font-bold uppercase tracking-[0.25em] text-gold-soft backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-white"
            style={{
              boxShadow: '0 0 18px 1px rgba(14,124,102,0.55), inset 0 0 12px rgba(14,124,102,0.25)',
              textShadow: '0 0 10px rgba(14,124,102,0.85)',
            }}
          >
            {({ nl: 'Bekijk de agenda', en: 'View the calendar', es: 'Ver la agenda', de: 'Zum Kalender', fr: 'Voir l’agenda' } as Record<string, string>)[locale] || 'View the calendar'}
          </Link>
          {/* Directly under the call to action: the moment someone is deciding
              whether to click is the moment social proof is worth anything. */}
          {rating ? <HeroRatingBadge {...rating} locale={locale as any} /> : null}

          {/* Vier ingangen, als de tegels van een app. Eén tik en je glijdt
              naar die wereld; de kleurstip is dezelfde als de bies in het
              menu en de zone eronder, zodat kleur overal hetzelfde betekent. */}
          <nav aria-label="Categorieën" className="pointer-events-auto mt-6 grid w-full max-w-md grid-cols-2 gap-2 md:max-w-2xl md:grid-cols-4">
            {ZONES.map(z => (
              <a
                key={z.id}
                href={`#${z.id}`}
                // Twee keer springen. De zones staan onder rijen met lui
                // geladen beeld; na de eerste sprong laden die alsnog en
                // schuift het doel honderden pixels op. De nasprong, als de
                // lay-out tot rust is gekomen, zet je alsnog op de kop.
                onClick={(e) => {
                  e.preventDefault()
                  const doel = document.getElementById(z.id)
                  if (!doel) return
                  doel.scrollIntoView({ behavior: 'smooth' })
                  setTimeout(() => doel.scrollIntoView({ behavior: 'smooth' }), 700)
                  setTimeout(() => doel.scrollIntoView({ behavior: 'auto' }), 1400)
                }}
                className="flex min-h-[52px] items-center justify-center gap-1.5 rounded-2xl border border-white/25 bg-black/35 px-2 py-2.5 text-[10px] font-black uppercase leading-tight tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-black/55 md:text-[11px] md:tracking-widest"
              >
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: z.stip }} />
                <span className="leading-tight">{z.naam[locale] || z.naam.en}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Live picker, in the first viewport. It was below the fold with a
            small legend, so the whole traffic-light system — which is real,
            time-based data — was invisible to anyone who did not scroll. Each
            item links straight to that event's page, so a visitor can go from
            landing to booking without scrolling once. */}
        {pickerEvents.length > 0 && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 pb-[max(10px,env(safe-area-inset-bottom))]">
            <div className="bg-gradient-to-t from-black/80 via-black/55 to-transparent pb-2 pt-8">
              <HomeEventSlider
                /* 14, not 30. The slider repeats its list four times for the
                   seamless loop, so 30 events meant 120 club logos loading
                   inside the first viewport — measured at LCP 2.5s -> 2.9s.
                   Fourteen still fills the marquee; nobody sees item 15. */
                events={pickerEvents.slice(0, 14)}
                liveByClub={liveByClub}
                locale={locale}
                className="w-full bg-transparent"
                speed={0.7}
                showLegend
                legendWide
              />
            </div>
          </div>
        )}

      </header>

      <HomeCategoryCarousel deals={deals} base={base} locale={locale} />



      {/* Sectie 01 van de vier werelden; de rode heroknop landt hier. */}
      <HomeEventsTickets events={pickerEvents} locale={locale} base={base} />
      <HomeTonight events={pickerEvents} todayStr={todayStr} locale={locale} base={base} />



      {/* Vlootcarrousel: tussen "Vanavond op Ibiza" en Featured Events, op
          aanwijzing van de plek in de schermafbeelding. Wie net de agenda van
          vanavond heeft gezien, is precies in de stemming voor de dag ervoor —
          en dit is de sectie met de hoogste orderwaarde van de site. Dure en
          goedkope boten om en om; zie de selectie-functie voor waarom. */}
      {/* 3D-ring met boten, excursies en events — verving de platte rij van
          twaalf boten. Zie HomeRingCarousel voor waarom de animatie de site
          niet zwaarder maakt. */}
      <HomeRingCarousel locale={locale} base={base} events={pickerEvents} experienceDays={experienceDays} />

      {/* Wereld 02: de eigen vloot. De knop "On the Water" in de
          hero landt hier. */}
      <HomeBoats locale={locale} base={base} />

      {/* Wereld 03: alles wat geen clubavond en geen eigen boot is. Verving
          de dagrotator met de dagbalk -- die stond met dezelfde kiezer twee
          keer op de pagina en duwde de rest ver naar beneden. */}
      <HomeActivities days={experienceDays} locale={locale} base={base} />

      {/* De film staat hier en niet onder de hero. Onder de hero kwam hij vóór
          alles wat te koop is: je zag een kop, een knop en dan een video, en
          moest daar eerst langs om bij een event te komen. Hier heeft de
          bezoeker net de hele agenda gezien -- clubs, boten, activiteiten --
          en is dit de adempauze erna in plaats van een drempel ervoor.
          Laadt als poster met een afspeelknop; de speler van Vimeo komt pas in
          de pagina als je erop tikt. Zie HomeVimeo. */}
      <HomeVimeo id="352653740" hash="36444999f9" locale={locale} />

      {/* Boten en auto's. Stond onderaan de pagina, onder Instagram en de
          nieuwsbrief; hier volgt het direct op de strip met alles wat geen
          nachtclub is, waar het thuishoort en waar mensen nog kijken. */}
      {rentalsSlot}

      {/* Club logo marquee — just the logos — right below "Volledige kalender", above Populaire clubs */}
      <Reveal className="flex items-center bg-neutral-100 py-3 border-t border-b border-black/10">
        <ClubLogoSlider
          clubLogos={clubLogos}
          base={base}
          locale={locale}
          speed={0.9}
          onLight
          className="w-full bg-transparent"
        />
      </Reveal>

      {/* FEATURED CLUBS — premium card grid */}
      {featuredClubs.length > 0 && (
        <section className="py-8 md:py-12" style={{ background: '#0a0a0a' }}>
          <Reveal className="max-w-7xl mx-auto px-4">

            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="m-0 font-serif text-[1.625rem] font-black tracking-tight text-white">{translations.home_popular_clubs}</h2>
              </div>
              <Link
                href={`${base}/clubs`}
                className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-white border-2 border-white/25 hover:bg-white hover:text-black rounded-full px-6 py-3 transition-colors"
              >
                {translations.home_all_clubs} &rarr;
              </Link>
            </div>

            {/* Card grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }} className="clubs-grid-md">
              {featuredClubs.map((club, idx) => (
                <Link
                  href={`${base}/club-tickets/${club.slug}`}
                  key={club.slug}
                  className="club-card-premium"
                  style={{ '--idx': idx } as React.CSSProperties}
                >
                  {/* Background image */}
                  {(club.cover || club.picture) && (
                    <Image
                      src={club.cover || club.picture}
                      alt={club.name}
                      fill
                      className="club-card-img"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                  )}

                  {/* Always-on dark gradient at bottom */}
                  <div className="club-card-base-grad" />

                  {/* Hover slide-up panel */}
                  <div className="club-card-hover-panel">
                    <div className="club-card-hover-inner">
                      {club.whitelogo && (
                        <div className="club-card-logo-wrap">
                          <Image src={club.whitelogo} alt={club.name} width={120} height={28} className="club-card-logo" />
                        </div>
                      )}
                      <div className="club-card-name">{club.name}</div>
                      <div className="club-card-cta">{translations.home_view_events} →</div>
                    </div>
                  </div>

                  {/* Default bottom logo (visible when not hovering) */}
                  <div className="club-card-bottom">
                    {club.whitelogo ? (
                      <Image src={club.whitelogo} alt={club.name} width={100} height={22} className="club-card-bottom-logo" />
                    ) : (
                      <span className="club-card-bottom-name">{club.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile: all clubs link */}
            <div className="mt-8 text-center md:hidden">
              <Link href={`${base}/clubs`} className="btn fill w-full justify-center">
                {translations.home_view_all_clubs}
              </Link>
            </div>
          </Reveal>
        </section>
      )}


      {/* WHY US — trust-building USP row */}
      <HomeUSP locale={locale} />
      <div id="zone-insider" />

      {/* GOOGLE REVIEWS — echte beoordelingen, direct onder de beloftes. Het
          cijfer stond al in de hero en de footer; de reviews zelf alleen op
          /about-us, waar bijna niemand komt. Sociale bewijskracht hoort op de
          pagina met het meeste verkeer, naast de USP's die ze onderbouwen. */}
      {reviewsSlot}

      {/* INSTAGRAM — the island's vibe on your feed */}
      <HomeInstagram locale={locale} />

      {/* NEWSLETTER — lead capture */}
      <HomeNewsletter locale={locale} rating={rating} />

      {/* CATEGORIES GRID */}
      <section className="section bg-white text-neutral-900">
        <Reveal className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker !text-neutral-900">{translations.home_discover_all}</span>
              <h2 className="text-neutral-900 !font-serif !text-[1.625rem] !font-black !tracking-tight" style={{ marginTop: '12px' }}>{translations.home_popular_on_ibiza}</h2>
            </div>
          </div>
          
          <div className="cat-grid">
            <Link href={`${base}/calendar`} className="cat">
              <span className="num">01</span>
              <strong>{translations.home_cat_calendar}</strong>
              <span className="arrow">→</span>
            </Link>
            <Link href={`${base}/clubs`} className="cat">
              <span className="num">02</span>
              <strong>{translations.home_cat_clubs_venues}</strong>
              <span className="arrow">→</span>
            </Link>

            {/* SEO: /boats and /boat-party previously had ZERO internal links
                from the homepage, so nothing on the site signalled they matter.
                Both are target pages for "boat charter Ibiza" / "boat party
                Ibiza", so they belong in the main category grid. */}
            <Link href={`${base}/boat-party`} className="cat">
              <span className="num">03</span>
              <strong>{CAT_BOAT_PARTY[locale] || CAT_BOAT_PARTY.en}</strong>
              <span className="arrow">→</span>
            </Link>
            <Link href={`${base}/private-boat-charters`} className="cat">
              <span className="num">04</span>
              <strong>{CAT_CHARTER[locale] || CAT_CHARTER.en}</strong>
              <span className="arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FAQ — condensed sitewide FAQ, deliberately the very last section */}
      {faqSlot}
    </div>
  );
}
