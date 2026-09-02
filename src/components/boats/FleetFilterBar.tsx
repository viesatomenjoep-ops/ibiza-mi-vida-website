'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Users, Euro, MapPin, ArrowUpDown, X, Check } from 'lucide-react'

export type SortKey = 'default' | 'price-asc' | 'price-desc'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  date: T('Datum', 'Date', 'Datum', 'Fecha', 'Date'),
  anyDate: T('Elke datum', 'Any date', 'Jedes Datum', 'Cualquier fecha', 'Toute date'),
  onlyFree: T('Alleen beschikbaar', 'Only available', 'Nur verfügbare', 'Solo disponibles', 'Disponibles seulement'),
  guests: T('Gasten', 'Guests', 'Gäste', 'Invitados', 'Invités'),
  anyGuests: T('Elk aantal', 'Any number', 'Beliebig', 'Cualquiera', 'Peu importe'),
  guestsUp: T('{n}+ gasten', '{n}+ guests', '{n}+ Gäste', '{n}+ invitados', '{n}+ invités'),
  price: T('Prijs', 'Price', 'Preis', 'Precio', 'Prix'),
  anyPrice: T('Elk budget', 'Any budget', 'Jedes Budget', 'Cualquier precio', 'Tout budget'),
  upTo: T('Tot €{v}', 'Up to €{v}', 'Bis €{v}', 'Hasta €{v}', "Jusqu'à €{v}"),
  perDay: T('per dag', 'per day', 'pro Tag', 'al día', 'par jour'),
  depart: T('Vertrek', 'Departure', 'Abfahrt', 'Salida', 'Départ'),
  allMarinas: T('Alle jachthavens', 'All marinas', 'Alle Marinas', 'Todos los puertos', 'Tous les ports'),
  sort: T('Sorteer', 'Sort', 'Sortieren', 'Ordenar', 'Trier'),
  sortDefault: T('Onze selectie', 'Our selection', 'Unsere Auswahl', 'Nuestra selección', 'Notre sélection'),
  sortAsc: T('Prijs: laag → hoog', 'Price: low → high', 'Preis: niedrig → hoch', 'Precio: bajo → alto', 'Prix : bas → haut'),
  sortDesc: T('Prijs: hoog → laag', 'Price: high → low', 'Preis: hoch → niedrig', 'Precio: alto → bajo', 'Prix : haut → bas'),
  clear: T('Wis filters', 'Clear filters', 'Filter löschen', 'Borrar filtros', 'Effacer'),
  done: T('Klaar', 'Done', 'Fertig', 'Listo', 'Terminé'),
  liveAt: T('Live stand {t}', 'Live status {t}', 'Live-Stand {t}', 'Estado en vivo {t}', 'État en direct {t}'),
}

const fill = (s: string, k: string, v: string | number) => s.replace(`{${k}}`, String(v))

/**
 * Filterbalk in Airbnb-stijl: een rij pillen die openklappen.
 *
 * ── Waarom pillen en geen schuifregelaar meer ─────────────────────────────
 * De vorige balk was één brede budgetschuif die het halve scherm vulde en
 * daarnaast een losse datumbalk. Dat leest als een instellingenscherm, niet
 * als zoeken. Airbnb doet het omgekeerd: een smalle rij knoppen die alleen
 * open gaan als je ze nodig hebt, met de gekozen waarde ín de knop. Zo zie je
 * in één oogopslag wat er aan staat en kost een ongebruikt filter geen ruimte.
 *
 * ── Waarom deze vier en niet meer ─────────────────────────────────────────
 * Datum, gasten, prijs en vertrekhaven — precies de vier waar de data
 * volledig is (94 van 94 boten). Een filter op iets wat we maar half weten
 * geeft een lege lijst waar boten in hadden moeten staan, en dat is erger dan
 * geen filter. Zie de opmerking in FleetShowcase over de schipper.
 *
 * ── Sluitgedrag ───────────────────────────────────────────────────────────
 * Eén paneel tegelijk, en klikken buiten de balk sluit. Escape ook, want een
 * paneel dat alleen met de muis weggaat is op een toetsenbord een val.
 */
export function FleetFilterBar({
  locale, marinas, priceMin, priceMax, paxMax,
  date, setDate, dateRange, onlyAvailable, setOnlyAvailable, liveStamp,
  minPax, setMinPax, maxPrice, setMaxPrice, marina, setMarina, sort, setSort,
  onClear, activeCount,
}: {
  locale: string
  marinas: string[]
  priceMin: number; priceMax: number; paxMax: number
  date: string | null; setDate: (d: string) => void
  dateRange: { start: string; end: string } | null
  onlyAvailable: boolean; setOnlyAvailable: (v: boolean) => void
  liveStamp: string | null
  minPax: number; setMinPax: (n: number) => void
  maxPrice: number; setMaxPrice: (n: number) => void
  marina: string; setMarina: (m: string) => void
  sort: SortKey; setSort: (s: SortKey) => void
  onClear: () => void; activeCount: number
}) {
  const [open, setOpen] = useState<string | null>(null)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const buiten = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(null) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('mousedown', buiten)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', buiten); document.removeEventListener('keydown', esc) }
  }, [open])

  const nf = (n: number) => n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as L5)[locale] || 'en-GB')

  const Pill = ({ id, icon, label, value, actief }: {
    id: string; icon: React.ReactNode; label: string; value: string; actief: boolean
  }) => (
    <button
      type="button"
      onClick={() => setOpen(open === id ? null : id)}
      aria-expanded={open === id}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-left transition-all ${
        actief
          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
          : open === id
            ? 'border-neutral-900 bg-white text-neutral-900 shadow-sm'
            : 'border-black/12 bg-white text-neutral-700 hover:border-neutral-400 hover:shadow-sm'
      }`}
    >
      <span className={actief ? 'text-white' : 'text-ibiza-green'}>{icon}</span>
      <span className="min-w-0">
        <span className={`block text-[9px] font-black uppercase tracking-[0.14em] ${actief ? 'text-white/60' : 'text-black/40'}`}>{label}</span>
        <span className="block truncate text-[13px] font-bold leading-tight">{value}</span>
      </span>
    </button>
  )

  const Paneel = ({ id, children }: { id: string; children: React.ReactNode }) =>
    open !== id ? null : (
      <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-black/10 bg-white p-4 shadow-xl sm:left-auto sm:right-auto sm:w-[300px]">
        {children}
        <button
          type="button"
          onClick={() => setOpen(null)}
          className="mt-3 w-full rounded-full bg-neutral-900 py-2 text-[12px] font-black uppercase tracking-widest text-white"
        >
          {t(L.done, locale)}
        </button>
      </div>
    )

  return (
    <div ref={wrap} className="sticky top-[var(--nav-h)] z-40 bg-white/95 py-3 backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none">
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="hide-scrollbar flex items-stretch gap-2 overflow-x-auto pb-1">
          {dateRange && (
            <div className="relative shrink-0">
              <Pill id="date" icon={<CalendarDays size={15} />} label={t(L.date, locale)}
                value={date ? new Date(date + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { day: 'numeric', month: 'short' }) : t(L.anyDate, locale)}
                actief={onlyAvailable} />
              <Paneel id="date">
                <input
                  type="date"
                  value={date ?? ''}
                  min={dateRange.start}
                  max={dateRange.end}
                  onChange={(e) => e.target.value && setDate(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-semibold"
                  aria-label={t(L.date, locale)}
                />
                <button
                  type="button"
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`mt-3 flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-bold transition-colors ${
                    onlyAvailable ? 'border-ibiza-green bg-ibiza-green/10 text-ibiza-green' : 'border-black/10 text-neutral-700'
                  }`}
                >
                  <span className={`grid h-4 w-4 place-items-center rounded border ${onlyAvailable ? 'border-ibiza-green bg-ibiza-green text-white' : 'border-black/25'}`}>
                    {onlyAvailable && <Check size={11} />}
                  </span>
                  {t(L.onlyFree, locale)}
                </button>
                {liveStamp && <p className="mt-2 text-[11px] text-black/40">{fill(t(L.liveAt, locale), 't', liveStamp)}</p>}
              </Paneel>
            </div>
          )}

          <div className="relative shrink-0">
            <Pill id="pax" icon={<Users size={15} />} label={t(L.guests, locale)}
              value={minPax > 0 ? fill(t(L.guestsUp, locale), 'n', minPax) : t(L.anyGuests, locale)}
              actief={minPax > 0} />
            <Paneel id="pax">
              <div className="flex flex-wrap gap-2">
                {[0, 4, 6, 8, 10, 12].filter(n => n === 0 || n <= paxMax).map(n => (
                  <button key={n} type="button" onClick={() => setMinPax(n)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                      minPax === n ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/12 text-neutral-700 hover:border-neutral-400'
                    }`}>
                    {n === 0 ? t(L.anyGuests, locale) : `${n}+`}
                  </button>
                ))}
              </div>
            </Paneel>
          </div>

          <div className="relative shrink-0">
            <Pill id="price" icon={<Euro size={15} />} label={t(L.price, locale)}
              value={maxPrice < priceMax ? fill(t(L.upTo, locale), 'v', nf(maxPrice)) : t(L.anyPrice, locale)}
              actief={maxPrice < priceMax} />
            <Paneel id="price">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-serif text-lg font-black">
                  {maxPrice < priceMax ? `€${nf(maxPrice)}` : `€${nf(priceMax)}+`}
                </span>
                <span className="text-[11px] text-black/45">{t(L.perDay, locale)}</span>
              </div>
              <input
                type="range" min={priceMin} max={priceMax} step={50} value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                className="fleet-range w-full"
                style={{ background: `linear-gradient(to right,#0E7C66 0%,#0E7C66 ${((maxPrice - priceMin) / (priceMax - priceMin)) * 100}%,#e5e5e5 ${((maxPrice - priceMin) / (priceMax - priceMin)) * 100}%,#e5e5e5 100%)` }}
                aria-label={t(L.price, locale)}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {[1000, 2000, 3500, 5000].filter(v => v > priceMin && v < priceMax).map(v => (
                  <button key={v} type="button" onClick={() => setMaxPrice(v)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
                      maxPrice === v ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/12 text-neutral-700 hover:border-neutral-400'
                    }`}>≤ €{nf(v)}</button>
                ))}
                <button type="button" onClick={() => setMaxPrice(priceMax)}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
                    maxPrice >= priceMax ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/12 text-neutral-700 hover:border-neutral-400'
                  }`}>{t(L.anyPrice, locale)}</button>
              </div>
            </Paneel>
          </div>

          <div className="relative shrink-0">
            <Pill id="marina" icon={<MapPin size={15} />} label={t(L.depart, locale)}
              value={marina === 'all' ? t(L.allMarinas, locale) : marina}
              actief={marina !== 'all'} />
            <Paneel id="marina">
              <div className="flex flex-col gap-1">
                {['all', ...marinas].map(m => (
                  <button key={m} type="button" onClick={() => { setMarina(m); setOpen(null) }}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-bold transition-colors ${
                      marina === m ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}>
                    {m === 'all' ? t(L.allMarinas, locale) : m}
                    {marina === m && <Check size={14} />}
                  </button>
                ))}
              </div>
            </Paneel>
          </div>

          <div className="relative shrink-0">
            <Pill id="sort" icon={<ArrowUpDown size={15} />} label={t(L.sort, locale)}
              value={sort === 'price-asc' ? t(L.sortAsc, locale) : sort === 'price-desc' ? t(L.sortDesc, locale) : t(L.sortDefault, locale)}
              actief={sort !== 'default'} />
            <Paneel id="sort">
              <div className="flex flex-col gap-1">
                {([['default', L.sortDefault], ['price-asc', L.sortAsc], ['price-desc', L.sortDesc]] as [SortKey, L5][]).map(([k, lab]) => (
                  <button key={k} type="button" onClick={() => { setSort(k); setOpen(null) }}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-bold transition-colors ${
                      sort === k ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}>
                    {t(lab, locale)}
                    {sort === k && <Check size={14} />}
                  </button>
                ))}
              </div>
            </Paneel>
          </div>

          {activeCount > 0 && (
            <button type="button" onClick={onClear}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/12 bg-white px-4 text-[12px] font-bold text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black">
              <X size={13} /> {t(L.clear, locale)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
