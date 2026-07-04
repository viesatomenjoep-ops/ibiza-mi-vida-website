import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowLeft, Check, Info, Camera, HelpCircle, Ticket, Clock, Music, Sparkles, Navigation, AlertCircle, Utensils, Anchor, Waves } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CTVenue, CTEventDate } from '@/lib/clubtickets'
import { EventTicketSelector } from './EventTicketSelector'
import { VenueLocationMap } from '@/components/ui/VenueLocationMap'
import { stripHtml } from '@/lib/html-utils'
import { parseCTDescription } from '@/lib/ct-description'

import en from '@/dictionaries/en.json'
import nl from '@/dictionaries/nl.json'
import es from '@/dictionaries/es.json'
import de from '@/dictionaries/de.json'
import fr from '@/dictionaries/fr.json'

const dicts: Record<string, any> = { en, nl, es, de, fr }

// ── Local i18n for the enriched sections + FAQ ──────────────────────────────────
interface FaqCtx {
  event: string;
  venue: string;
  datesText: string;
  timeText: string;
  lineupText: string;
}
interface EventLabels {
  aboutTitle: (e: string) => string;
  importantTitle: string;
  galleryTitle: string;
  locationTitle: string;
  faqKicker: string;
  faqTitle: (e: string) => string;
  faqs: (c: FaqCtx) => { q: string; a: string }[];
}

const EVENT_I18N: Record<string, EventLabels> = {
  en: {
    aboutTitle: (e) => `About ${e}`,
    importantTitle: 'Important information',
    galleryTitle: 'Gallery',
    locationTitle: 'Location',
    faqKicker: 'Good to know',
    faqTitle: (e) => `FAQs — ${e}`,
    faqs: (c) => [
      { q: `How do I get to ${c.event} at ${c.venue}?`, a: `${c.venue} is located on the island of Ibiza. Check the interactive map below for the exact spot and the best route from your hotel — by taxi, bus or car.` },
      { q: `What are the dates and times for ${c.event}?`, a: `${c.datesText} ${c.timeText} We recommend arriving a little early to avoid queues at the entrance.` },
      { q: `What is the age requirement for ${c.event}?`, a: `Most events in Ibiza operate an 18+ policy. Always bring a valid ID or passport with you.` },
      { q: `What can I expect at ${c.event}?`, a: c.lineupText ? `Expect ${c.lineupText}. The full programme for each date is listed above.` : `A carefully curated experience — see the description and the dates above for the full details.` },
      { q: `What is the dress code for ${c.event}?`, a: `Smart-casual is a safe choice. Comfortable footwear is recommended; some nights apply a stricter door policy.` },
      { q: `How much does it cost?`, a: `Prices per date are shown above and may vary by demand. Booking early is the best way to secure the lowest price.` },
      { q: `Can I book VIP or a private option for ${c.event}?`, a: `VIP tickets, tables and private options are often available. Message us and we'll arrange the best spot for your group.` },
      { q: `Any tips for ${c.event}?`, a: `Book in advance — popular dates sell out fast. Arrive early, stay hydrated, and keep your ticket and ID ready at the door.` },
    ],
  },
  nl: {
    aboutTitle: (e) => `Over ${e}`,
    importantTitle: 'Belangrijke informatie',
    galleryTitle: 'Galerij',
    locationTitle: 'Locatie',
    faqKicker: 'Goed om te weten',
    faqTitle: (e) => `Veelgestelde vragen — ${e}`,
    faqs: (c) => [
      { q: `Hoe kom ik bij ${c.event} in ${c.venue}?`, a: `${c.venue} ligt op het eiland Ibiza. Bekijk de interactieve kaart hieronder voor de exacte locatie en de beste route vanaf je hotel — met taxi, bus of auto.` },
      { q: `Wat zijn de data en tijden van ${c.event}?`, a: `${c.datesText} ${c.timeText} We raden aan om iets eerder te komen om wachtrijen bij de ingang te vermijden.` },
      { q: `Wat is de leeftijdsgrens voor ${c.event}?`, a: `De meeste events op Ibiza hanteren een 18+ beleid. Neem altijd een geldig ID of paspoort mee.` },
      { q: `Wat kan ik verwachten bij ${c.event}?`, a: c.lineupText ? `Verwacht ${c.lineupText}. Het volledige programma per datum staat hierboven.` : `Een zorgvuldig samengestelde ervaring — bekijk de beschrijving en de data hierboven voor alle details.` },
      { q: `Wat is de dresscode voor ${c.event}?`, a: `Smart-casual is een veilige keuze. Comfortabele schoenen worden aangeraden; sommige avonden hanteren een strenger deurbeleid.` },
      { q: `Hoeveel kost het?`, a: `De prijzen per datum staan hierboven en kunnen variëren op basis van vraag. Vroeg boeken is de beste manier om de laagste prijs te krijgen.` },
      { q: `Kan ik VIP of een privé-optie boeken voor ${c.event}?`, a: `VIP-tickets, tafels en privé-opties zijn vaak beschikbaar. Stuur ons een bericht en we regelen de beste plek voor je groep.` },
      { q: `Nog tips voor ${c.event}?`, a: `Boek op tijd — populaire data zijn snel uitverkocht. Kom vroeg, blijf gehydrateerd en houd je ticket en ID klaar bij de deur.` },
    ],
  },
  de: {
    aboutTitle: (e) => `Über ${e}`,
    importantTitle: 'Wichtige Informationen',
    galleryTitle: 'Galerie',
    locationTitle: 'Lage',
    faqKicker: 'Gut zu wissen',
    faqTitle: (e) => `FAQs — ${e}`,
    faqs: (c) => [
      { q: `Wie komme ich zu ${c.event} im ${c.venue}?`, a: `${c.venue} befindet sich auf der Insel Ibiza. Sehen Sie sich die interaktive Karte unten für den genauen Standort und die beste Route von Ihrem Hotel an — per Taxi, Bus oder Auto.` },
      { q: `Was sind die Termine und Zeiten für ${c.event}?`, a: `${c.datesText} ${c.timeText} Wir empfehlen, etwas früher zu kommen, um Warteschlangen am Eingang zu vermeiden.` },
      { q: `Welche Altersvoraussetzung gilt für ${c.event}?`, a: `Die meisten Events auf Ibiza haben eine 18+-Regelung. Bringen Sie immer einen gültigen Ausweis oder Reisepass mit.` },
      { q: `Was kann ich bei ${c.event} erwarten?`, a: c.lineupText ? `Erwarten Sie ${c.lineupText}. Das vollständige Programm pro Termin finden Sie oben.` : `Ein sorgfältig kuratiertes Erlebnis — Details finden Sie in der Beschreibung und den Terminen oben.` },
      { q: `Was ist der Dresscode für ${c.event}?`, a: `Smart-Casual ist eine sichere Wahl. Bequemes Schuhwerk wird empfohlen; an manchen Abenden gilt eine strengere Einlasspolitik.` },
      { q: `Wie viel kostet es?`, a: `Die Preise pro Termin sind oben angegeben und können je nach Nachfrage variieren. Frühzeitig buchen sichert den besten Preis.` },
      { q: `Kann ich VIP oder eine private Option für ${c.event} buchen?`, a: `VIP-Tickets, Tische und private Optionen sind oft verfügbar. Schreiben Sie uns und wir organisieren den besten Platz für Ihre Gruppe.` },
      { q: `Tipps für ${c.event}?`, a: `Buchen Sie im Voraus — beliebte Termine sind schnell ausverkauft. Kommen Sie früh, trinken Sie ausreichend und halten Sie Ticket und Ausweis am Eingang bereit.` },
    ],
  },
  es: {
    aboutTitle: (e) => `Sobre ${e}`,
    importantTitle: 'Información importante',
    galleryTitle: 'Galería',
    locationTitle: 'Ubicación',
    faqKicker: 'Bueno saberlo',
    faqTitle: (e) => `Preguntas frecuentes — ${e}`,
    faqs: (c) => [
      { q: `¿Cómo llego a ${c.event} en ${c.venue}?`, a: `${c.venue} se encuentra en la isla de Ibiza. Consulta el mapa interactivo de abajo para ver la ubicación exacta y la mejor ruta desde tu hotel — en taxi, autobús o coche.` },
      { q: `¿Cuáles son las fechas y horarios de ${c.event}?`, a: `${c.datesText} ${c.timeText} Recomendamos llegar un poco antes para evitar colas en la entrada.` },
      { q: `¿Cuál es el requisito de edad para ${c.event}?`, a: `La mayoría de los eventos en Ibiza aplican una política de +18. Lleva siempre un documento de identidad o pasaporte válido.` },
      { q: `¿Qué puedo esperar en ${c.event}?`, a: c.lineupText ? `Espera ${c.lineupText}. El programa completo por fecha aparece arriba.` : `Una experiencia cuidadosamente seleccionada — consulta la descripción y las fechas de arriba para todos los detalles.` },
      { q: `¿Cuál es el código de vestimenta para ${c.event}?`, a: `El estilo smart-casual es una opción segura. Se recomienda calzado cómodo; algunas noches aplican una política de acceso más estricta.` },
      { q: `¿Cuánto cuesta?`, a: `Los precios por fecha se muestran arriba y pueden variar según la demanda. Reservar con antelación es la mejor forma de conseguir el mejor precio.` },
      { q: `¿Puedo reservar VIP o una opción privada para ${c.event}?`, a: `A menudo hay entradas VIP, mesas y opciones privadas disponibles. Escríbenos y organizaremos el mejor sitio para tu grupo.` },
      { q: `¿Algún consejo para ${c.event}?`, a: `Reserva con antelación — las fechas populares se agotan rápido. Llega temprano, mantente hidratado y ten a mano tu entrada e identificación en la puerta.` },
    ],
  },
  fr: {
    aboutTitle: (e) => `À propos de ${e}`,
    importantTitle: 'Informations importantes',
    galleryTitle: 'Galerie',
    locationTitle: 'Emplacement',
    faqKicker: 'Bon à savoir',
    faqTitle: (e) => `FAQ — ${e}`,
    faqs: (c) => [
      { q: `Comment se rendre à ${c.event} au ${c.venue} ?`, a: `${c.venue} se situe sur l'île d'Ibiza. Consultez la carte interactive ci-dessous pour l'emplacement exact et le meilleur itinéraire depuis votre hôtel — en taxi, bus ou voiture.` },
      { q: `Quelles sont les dates et horaires de ${c.event} ?`, a: `${c.datesText} ${c.timeText} Nous vous recommandons d'arriver un peu en avance pour éviter les files d'attente à l'entrée.` },
      { q: `Quel est l'âge requis pour ${c.event} ?`, a: `La plupart des événements à Ibiza appliquent une politique +18. Munissez-vous toujours d'une pièce d'identité ou d'un passeport valide.` },
      { q: `À quoi puis-je m'attendre à ${c.event} ?`, a: c.lineupText ? `Attendez-vous à ${c.lineupText}. Le programme complet par date est indiqué ci-dessus.` : `Une expérience soigneusement sélectionnée — consultez la description et les dates ci-dessus pour tous les détails.` },
      { q: `Quel est le code vestimentaire pour ${c.event} ?`, a: `Le style smart-casual est un choix sûr. Des chaussures confortables sont recommandées ; certaines soirées appliquent une politique d'entrée plus stricte.` },
      { q: `Combien ça coûte ?`, a: `Les prix par date sont indiqués ci-dessus et peuvent varier selon la demande. Réserver tôt est le meilleur moyen d'obtenir le meilleur prix.` },
      { q: `Puis-je réserver une option VIP ou privée pour ${c.event} ?`, a: `Des billets VIP, des tables et des options privées sont souvent disponibles. Écrivez-nous et nous organiserons le meilleur emplacement pour votre groupe.` },
      { q: `Des conseils pour ${c.event} ?`, a: `Réservez à l'avance — les dates populaires se vendent vite. Arrivez tôt, restez hydraté et gardez votre billet et votre pièce d'identité prêts à l'entrée.` },
    ],
  },
}

// Labels for the collapsible Line-up / Times sections
const SECTION_I18N: Record<string, { lineup: string; times: string; doors: string; closes: string; noTimes: string; noLineup: string }> = {
  en: { lineup: 'Line-up', times: 'Times', doors: 'Doors open', closes: 'Closes', noTimes: 'Exact times are announced closer to the date.', noLineup: 'The full line-up is announced closer to the date.' },
  nl: { lineup: 'Line-up', times: 'Tijden', doors: 'Deuren open', closes: 'Sluit', noTimes: 'De exacte tijden worden dichter bij de datum bekendgemaakt.', noLineup: 'De volledige line-up wordt dichter bij de datum bekendgemaakt.' },
  de: { lineup: 'Line-up', times: 'Zeiten', doors: 'Einlass', closes: 'Ende', noTimes: 'Die genauen Zeiten werden näher am Termin bekannt gegeben.', noLineup: 'Das vollständige Line-up wird näher am Termin bekannt gegeben.' },
  es: { lineup: 'Line-up', times: 'Horarios', doors: 'Apertura', closes: 'Cierre', noTimes: 'Los horarios exactos se anuncian más cerca de la fecha.', noLineup: 'El line-up completo se anuncia más cerca de la fecha.' },
  fr: { lineup: 'Line-up', times: 'Horaires', doors: 'Ouverture', closes: 'Fermeture', noTimes: 'Les horaires exacts sont annoncés à l’approche de la date.', noLineup: 'Le line-up complet est annoncé à l’approche de la date.' },
}

const BCP: Record<string, string> = { en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' }

/** Turn the API "requirements" HTML into a clean list of bullet points. */
function parseImportant(html?: string): string[] {
  if (!html) return [];
  const withBreaks = html
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n');
  return withBreaks
    .split('\n')
    .map(line => stripHtml(line).replace(/^[-•·]\s*/, '').trim())
    .filter(line => line.length > 1 && !/^-+$/.test(line) && line.toUpperCase() !== 'IMPORTANT:' && line.toUpperCase() !== 'IMPORTANT');
}

// Labels for the itinerary / highlights blocks (section titles themselves come localized from CT)
const ROUTE_I18N: Record<string, { itinerary: string; highlights: string }> = {
  en: { itinerary: 'Itinerary', highlights: 'Highlights' },
  nl: { itinerary: 'Routebeschrijving', highlights: 'Hoogtepunten' },
  de: { itinerary: 'Routenverlauf', highlights: 'Highlights' },
  es: { itinerary: 'Itinerario', highlights: 'Destacados' },
  fr: { itinerary: 'Itinéraire', highlights: 'Points forts' },
}

/** Pick a fitting icon for a CT section title (multilingual keyword match). */
function sectionIcon(title: string) {
  const t = title.toLowerCase()
  if (/includ|inclu|inbegrep|enthalt|incluso/.test(t)) return Sparkles
  if (/meeting|point|punto|treffpunkt|ontmoet|rendez|encuentro|lieu/.test(t)) return MapPin
  if (/check|depart|salida|abfahrt|vertrek|départ|return|regres|retour|rückkehr/.test(t)) return Clock
  if (/itinerar|route|ruta|verlauf/.test(t)) return Navigation
  if (/ticket|tipo|type|typ|billet|entrada/.test(t)) return Ticket
  if (/import|belangrijk|wichtig|importante/.test(t)) return AlertCircle
  if (/food|lunch|comida|essen|eten|repas|drink|bar|beverage/.test(t)) return Utensils
  if (/boat|barco|boot|bateau|schiff|cruise|sail|navega/.test(t)) return Anchor
  if (/swim|beach|playa|strand|plage|water|agua/.test(t)) return Waves
  return Check
}

interface EventDetailPageProps {
  club: CTVenue;
  eventDates: CTEventDate[];
  eventSlug: string;
  locale: string;
  basePath: string; // e.g. "tours", "activities"
}

export function EventDetailPage({ club, eventDates, eventSlug, locale, basePath }: EventDetailPageProps) {
  const eventDetail = club.events?.find(e => e.slug === eventSlug)
  const t = dicts[locale] || dicts['en']
  const T = EVENT_I18N[locale] || EVENT_I18N.en
  const S = SECTION_I18N[locale] || SECTION_I18N.en
  const bcp = BCP[locale] || 'en-GB'

  const eventName = eventDetail?.name || eventDates[0]?.eventName || 'Event'
  const eventCover = eventDetail?.cover || eventDetail?.logo || club.cover || club.picture || ''
  const description = eventDetail?.description || club.description || ''

  const R = ROUTE_I18N[locale] || ROUTE_I18N.en
  const desc = parseCTDescription(description)
  const hasAbout = desc.intro.length > 0 || desc.chips.length > 0 || desc.sections.length > 0 || desc.itinerary.length > 0

  const important = parseImportant(eventDetail?.requirements)

  // Gallery — unique, real photos (skip transparent logos).
  const gallery = Array.from(new Set([
    eventDetail?.cover, club.cover, eventDetail?.logo, club.picture,
  ].filter(Boolean) as string[]))

  const formatLineUp = (lineUp?: string) => {
    if (!lineUp) return '';
    let text = lineUp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    text = text.replace(/(\s*-\s*)+/g, ', ');
    if (text.startsWith(',')) text = text.substring(1).trim();
    return text;
  };

  // FAQ context derived from the ClubTickets data.
  const upcoming = eventDates.slice(0, 3).map(d =>
    new Date(d.date).toLocaleDateString(bcp, { day: 'numeric', month: 'long', timeZone: 'UTC' })
  )
  const datesText = upcoming.length
    ? `${t.event_next_dates || 'Upcoming dates:'} ${upcoming.join(', ')}${eventDates.length > 3 ? '…' : '.'}`
    : (t.event_see_dates || 'See all upcoming dates above.')
  const timeText = eventDetail?.startAt ? `${t.event_start_time || 'Start time'} ${eventDetail.startAt}.` : ''
  const lineupText = formatLineUp(eventDates[0]?.lineUp)
  const faqs = T.faqs({ event: eventName, venue: club.name, datesText, timeText, lineupText })

  // Line-up per date (only dates that actually carry a line-up)
  const lineupDates = eventDates
    .map(d => ({
      label: new Date(d.date).toLocaleDateString(bcp, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }),
      artists: formatLineUp(d.lineUp).split(',').map(a => a.trim()).filter(Boolean),
    }))
    .filter(d => d.artists.length > 0)
  const hasLineup = lineupDates.length > 0

  // Times come from the ClubTickets event record (startAt / endAt)
  const startAt = eventDetail?.startAt
  const endAt = eventDetail?.endAt
  const hasTimes = !!(startAt || endAt)

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] flex-col justify-end overflow-hidden" aria-label={`${eventName} hero`}>
        {eventCover && (
          <Image src={eventCover} alt={eventName} fill priority className="object-cover object-center" sizes="100vw" quality={85} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian via-velvet-obsidian/50 to-transparent" />

        <div className="absolute left-4 top-24 z-10 md:left-8">
          <Link
            href={`/${locale}/${basePath}/${club.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-ibiza-sand backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={14} />
            {t.event_back_to || 'Back to'} {club.name}
          </Link>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8">
          <h1 className="font-serif text-4xl font-bold text-ibiza-sand md:text-5xl lg:text-6xl">{eventName}</h1>
          <div className="mt-4 flex flex-wrap gap-4 font-bold text-ibiza-sand/80">
            <Link href={`/${locale}/${basePath}/${club.slug}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <MapPin size={16} className="text-ibiza-green" />
              {club.name}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 pb-32 md:px-8">
        <div className="flex flex-col gap-12">
          {/* Dates + tickets */}
          <div id="tickets">
            <AnimatedSection delay={100} className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-3xl font-black text-black md:text-4xl">{t.event_select_date_book || 'Select date & book'}</h2>
                <p className="mt-2 font-sans text-velvet-obsidian/60">
                  {t.event_all_dates_for || 'All upcoming dates for'} {eventName} {t.event_at || 'at'} {club.name}. {t.event_book_securely || 'Book securely via ClubTickets.'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {eventDates.map((dateObj, idx) => (
                  <div key={`${dateObj.id}-${idx}`} className="group flex flex-col justify-between gap-4 rounded-2xl border border-velvet-obsidian/10 bg-white p-5 transition-all hover:border-ibiza-green/40 hover:shadow-md sm:flex-row sm:items-center">
                    <div className="flex w-full flex-col gap-1 sm:w-2/3">
                      <span className="font-serif text-xl font-bold text-velvet-obsidian transition-colors group-hover:text-ibiza-green">{dateObj.eventName || eventName}</span>
                      <span className="flex items-center gap-2 text-sm font-medium text-velvet-obsidian/60">
                        <span className="shrink-0 rounded-md bg-ibiza-green/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-ibiza-green">
                          {new Date(dateObj.date).toLocaleDateString(bcp, { weekday: 'short', timeZone: 'UTC' })}
                        </span>
                        {new Date(dateObj.date).toLocaleDateString(bcp, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                      </span>
                      {formatLineUp(dateObj.lineUp) && (
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500">
                          <span className="mt-0.5 shrink-0 text-ibiza-green">✓</span>
                          <span className="line-clamp-2">{formatLineUp(dateObj.lineUp)}</span>
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex w-full shrink-0 items-center justify-between gap-4 sm:mt-0 sm:w-auto sm:justify-end sm:gap-6">
                      <div className="flex w-full flex-col items-end sm:w-auto">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.event_price || 'Price'}</span>
                        <span className="mb-3 text-lg font-bold text-velvet-obsidian">{dateObj.prices ? dateObj.prices : (t.event_available || 'Available')}</span>
                        <EventTicketSelector
                          id={dateObj.id.toString()}
                          title={dateObj.eventName || eventName}
                          date={dateObj.date}
                          priceStr={dateObj.prices || '50'}
                          image={eventCover}
                          affLink={dateObj.affLink}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Line-up (collapsible) */}
          {hasLineup && (
            <AnimatedSection delay={130}>
              <details open className="group rounded-[28px] border border-black/10 bg-white p-6 shadow-sm open:shadow-md md:p-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl font-black text-black marker:content-[''] [&::-webkit-details-marker]:hidden md:text-3xl">
                  <span className="flex items-center gap-2"><Music size={24} className="text-ibiza-green" /> {S.lineup}</span>
                  <span className="shrink-0 text-3xl font-light text-ibiza-green transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-5 flex flex-col gap-5">
                  {lineupDates.map((d, i) => (
                    <div key={i}>
                      {lineupDates.length > 1 && (
                        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ibiza-green">{d.label}</div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {d.artists.map((a, j) => (
                          <span key={j} className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-black/80 ring-1 ring-black/5">{a}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </AnimatedSection>
          )}

          {/* Times (collapsible) */}
          {hasTimes && (
            <AnimatedSection delay={160}>
              <details open className="group rounded-[28px] border border-black/10 bg-white p-6 shadow-sm open:shadow-md md:p-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl font-black text-black marker:content-[''] [&::-webkit-details-marker]:hidden md:text-3xl">
                  <span className="flex items-center gap-2"><Clock size={24} className="text-ibiza-green" /> {S.times}</span>
                  <span className="shrink-0 text-3xl font-light text-ibiza-green transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-5 flex flex-wrap gap-3">
                  {startAt && (
                    <div className="flex flex-col rounded-2xl border border-black/10 bg-neutral-50 px-5 py-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-black/50">{S.doors}</span>
                      <span className="text-2xl font-black text-black">{startAt}</span>
                    </div>
                  )}
                  {endAt && (
                    <div className="flex flex-col rounded-2xl border border-black/10 bg-neutral-50 px-5 py-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-black/50">{S.closes}</span>
                      <span className="text-2xl font-black text-black">{endAt}</span>
                    </div>
                  )}
                </div>
              </details>
            </AnimatedSection>
          )}

          {/* About (collapsible, richly structured) */}
          {hasAbout && (
            <AnimatedSection delay={180}>
              <details open className="group rounded-[28px] border border-black/10 bg-white p-6 shadow-sm open:shadow-md md:p-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl font-black text-black marker:content-[''] [&::-webkit-details-marker]:hidden md:text-3xl">
                  <span className="flex items-center gap-2"><Info size={24} className="text-ibiza-green" /> {T.aboutTitle(eventName)}</span>
                  <span className="shrink-0 text-3xl font-light text-ibiza-green transition-transform group-open:rotate-45">+</span>
                </summary>

                {/* Quick-fact chips */}
                {desc.chips.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {desc.chips.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-ibiza-green/12 px-3.5 py-1.5 text-sm font-bold text-black ring-1 ring-ibiza-green/30">
                        <Sparkles size={14} className="text-ibiza-green" /> {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Intro paragraphs */}
                {desc.intro.length > 0 && (
                  <div className="mt-6 flex flex-col gap-4 text-base font-semibold leading-relaxed text-black">
                    {desc.intro.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                )}

                {/* Section cards — tight 2-column grid with icons */}
                {desc.sections.length > 0 && (
                  <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {desc.sections.map((s, i) => {
                      const Icon = sectionIcon(s.title)
                      return (
                        <div key={i} className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
                          <div className="mb-3 flex items-center gap-2.5">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ibiza-green/15 text-black">
                              <Icon size={17} />
                            </span>
                            <h3 className="font-serif text-lg font-black text-black">{s.title}</h3>
                          </div>
                          <ul className="flex flex-col gap-2">
                            {s.items.map((it, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-base font-semibold leading-snug text-black">
                                <Check size={16} className="mt-0.5 shrink-0 text-ibiza-green" />
                                <span>{it}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Itinerary — vertical timeline */}
                {desc.itinerary.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-5 flex items-center gap-2 font-serif text-xl font-black text-black">
                      <Navigation size={20} className="text-ibiza-green" /> {R.itinerary}
                    </h3>
                    <ol className="relative flex flex-col gap-6 pl-2">
                      <span className="absolute left-[14px] top-2 bottom-2 w-0.5 bg-ibiza-green/25" aria-hidden />
                      {desc.itinerary.map((stop, i) => (
                        <li key={i} className="relative flex gap-4 pl-8">
                          <span className="absolute left-0 top-0.5 grid h-7 w-7 place-items-center rounded-full border-2 border-ibiza-green bg-white text-[11px] font-black text-black">
                            {i + 1}
                          </span>
                          <div className="flex flex-col">
                            {stop.time && (
                              <span className="mb-0.5 inline-flex w-fit items-center gap-1 rounded-md bg-ibiza-green/15 px-2 py-0.5 text-xs font-bold text-black">
                                <Clock size={12} /> {stop.time}
                              </span>
                            )}
                            <span className="font-bold text-black">{stop.title}</span>
                            {stop.sub && <span className="text-sm leading-snug text-black/60">{stop.sub}</span>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </details>
            </AnimatedSection>
          )}

          {/* Important information (collapsible) */}
          {important.length > 0 && (
            <AnimatedSection delay={200}>
              <details open className="group rounded-[28px] border border-black/10 bg-neutral-50 p-6 shadow-sm open:shadow-md md:p-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl font-black text-black marker:content-[''] [&::-webkit-details-marker]:hidden md:text-3xl">
                  <span className="flex items-center gap-2"><Check size={24} className="text-ibiza-green" /> {T.importantTitle}</span>
                  <span className="shrink-0 text-3xl font-light text-ibiza-green transition-transform group-open:rotate-45">+</span>
                </summary>
                <ul className="mt-5 flex flex-col gap-3">
                  {important.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-black/80">
                      <Check size={18} className="mt-1 shrink-0 text-ibiza-green" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </AnimatedSection>
          )}

          {/* Gallery */}
          {gallery.length > 1 && (
            <AnimatedSection delay={220}>
              <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl font-black text-black md:text-3xl">
                <Camera size={24} className="text-ibiza-green" /> {T.galleryTitle}
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
                {gallery.map((src, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-2xl bg-neutral-100 ${i === 0 ? 'col-span-2 aspect-[16/10] md:col-span-2 md:row-span-2' : 'aspect-[4/3]'}`}>
                    <Image src={src} alt={`${eventName} ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Location */}
          <AnimatedSection delay={250}>
            <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl font-black text-black md:text-3xl">
              <MapPin size={24} className="text-ibiza-green" /> {T.locationTitle}
            </h2>
            <VenueLocationMap venueName={club.name} locale={locale} />
          </AnimatedSection>

          {/* FAQ */}
          <AnimatedSection delay={280}>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-ibiza-green">{T.faqKicker}</div>
            <h2 className="mb-6 mt-2 flex items-center gap-2 font-serif text-3xl font-black text-black md:text-4xl">
              <HelpCircle size={28} className="text-ibiza-green" /> {T.faqTitle(eventName)}
            </h2>
            <div className="flex flex-col gap-3">
              {faqs.map((f, i) => (
                <details key={i} className="group rounded-2xl border border-black/10 bg-white p-5 open:border-ibiza-green/40 open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-bold text-black marker:content-[''] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="shrink-0 text-2xl font-light text-ibiza-green transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-black/70">{f.a}</p>
                </details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Floating checkout bar (server-friendly anchor) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-black/10 bg-white/95 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-black/50">{t.event_from_price || 'From'}</span>
          <span className="text-xl font-black text-black">{eventDates[0]?.prices || '€30'}</span>
        </div>
        <a
          href="#tickets"
          className="inline-flex items-center gap-2 rounded-full bg-ibiza-green px-8 py-3.5 font-black uppercase tracking-wider text-black shadow-lg transition-all hover:brightness-95 active:scale-95"
        >
          <Ticket size={18} /> {t.event_select_tickets || 'Select tickets'}
        </a>
      </div>
    </div>
  )
}
