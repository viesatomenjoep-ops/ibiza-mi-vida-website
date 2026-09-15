'use client';

import React from 'react';
import { Ship, Users, Euro, Check } from 'lucide-react';
import type { FleetCategory } from '@/data/fleet';

/**
 * Drie stappen boven de vloot: soort → gezelschap → budget.
 *
 * De pagina begon met 94 kaarten en een filterbalk waarin alles tegelijk
 * openstond. Dat is voor ons leesbaar omdat wij de vloot kennen; voor iemand
 * die "boot huren Ibiza" gezocht heeft is het een muur. De drie vragen
 * hieronder zijn precies de drie die Simon door de telefoon ook stelt, in
 * dezelfde volgorde, en ze zetten dezelfde filterstate die de balk eronder
 * gebruikt — het is een tweede ingang op één waarheid, geen tweede filter.
 *
 * Elke stap heeft een expliciete "maakt niet uit"-chip, zodat je een vraag
 * kunt overslaan zonder een keuze te maken die je niet meent. En de stappen
 * verbergen elkaar niet: wie de derde meteen wil, klikt de derde. Een wizard
 * die je door drie schermen duwt kost hier meer dan hij oplevert.
 */

export interface PaxStep { key: string; min: number }
export interface BudgetStep { key: string; min: number | null; max: number | null }

/** Minimaal aantal opvarenden per chip. 0 = maakt niet uit. */
export const PAX_STEPS: PaxStep[] = [
  { key: 'any', min: 0 },
  { key: 'six', min: 6 },
  { key: 'eight', min: 8 },
  { key: 'ten', min: 10 },
  { key: 'twelve', min: 12 },
]

/** Dagbudget per chip; null = geen grens aan die kant. */
export const BUDGET_STEPS: BudgetStep[] = [
  { key: 'any', min: null, max: null },
  { key: 'under1000', min: null, max: 1000 },
  { key: 'mid', min: 1000, max: 2500 },
  { key: 'upper', min: 2500, max: 5000 },
  { key: 'top', min: 5000, max: null },
]

interface StepLabels {
  intro: string
  step: (n: number) => string
  soortTitle: string
  soortHint: string
  paxTitle: string
  paxHint: string
  budgetTitle: string
  budgetHint: string
  any: string
  cat: Record<FleetCategory | 'all', string>
  pax: Record<string, string>
  budget: Record<string, string>
  resultaat: (n: number) => string
}

const I18N: Record<string, StepLabels> = {
  en: {
    intro: 'Three questions and the fleet narrows to the boats that fit.',
    step: (n) => `Step ${n}`,
    soortTitle: 'What kind of boat?',
    soortHint: 'A motorboat for a cove and a swim; a yacht from 50 ft for the whole day and a crew.',
    paxTitle: 'How many on board?',
    paxHint: 'Twelve guests is the legal maximum on a charter here.',
    budgetTitle: 'Budget per day?',
    budgetHint: 'Day rates, before fuel and skipper unless the dossier says otherwise.',
    any: 'Any',
    cat: { all: 'Any', yacht: 'Yacht', motorboat: 'Motorboat', catamaran: 'Catamaran', jetski: 'Jet ski', boat: 'Boat' },
    pax: { any: 'Any', six: '6 or more', eight: '8 or more', ten: '10 or more', twelve: '12' },
    budget: { any: 'Any', under1000: 'Under €1,000', mid: '€1,000 – €2,500', upper: '€2,500 – €5,000', top: '€5,000 and up' },
    resultaat: (n) => `${n} boats match`,
  },
  nl: {
    intro: 'Drie vragen en de vloot krimpt tot de boten die passen.',
    step: (n) => `Stap ${n}`,
    soortTitle: 'Wat voor boot?',
    soortHint: 'Een motorboot voor een baai en een duik; een jacht vanaf 50 ft voor de hele dag en bemanning.',
    paxTitle: 'Met hoeveel personen?',
    paxHint: 'Twaalf opvarenden is hier het wettelijke maximum op een charter.',
    budgetTitle: 'Budget per dag?',
    budgetHint: 'Dagtarieven, zonder brandstof en schipper tenzij het dossier anders zegt.',
    any: 'Maakt niet uit',
    cat: { all: 'Maakt niet uit', yacht: 'Jacht', motorboat: 'Motorboot', catamaran: 'Catamaran', jetski: 'Jetski', boat: 'Boot' },
    pax: { any: 'Maakt niet uit', six: '6 of meer', eight: '8 of meer', ten: '10 of meer', twelve: '12' },
    budget: { any: 'Maakt niet uit', under1000: 'Tot €1.000', mid: '€1.000 – €2.500', upper: '€2.500 – €5.000', top: '€5.000 en hoger' },
    resultaat: (n) => `${n} boten passen`,
  },
  de: {
    intro: 'Drei Fragen, und die Flotte schrumpft auf die passenden Boote.',
    step: (n) => `Schritt ${n}`,
    soortTitle: 'Welche Art Boot?',
    soortHint: 'Ein Motorboot für eine Bucht und ein Bad; eine Yacht ab 50 ft für den ganzen Tag und Crew.',
    paxTitle: 'Wie viele an Bord?',
    paxHint: 'Zwölf Gäste sind hier das gesetzliche Maximum auf einem Charter.',
    budgetTitle: 'Budget pro Tag?',
    budgetHint: 'Tagespreise, ohne Treibstoff und Skipper, sofern das Dossier nichts anderes sagt.',
    any: 'Egal',
    cat: { all: 'Egal', yacht: 'Yacht', motorboat: 'Motorboot', catamaran: 'Katamaran', jetski: 'Jetski', boat: 'Boot' },
    pax: { any: 'Egal', six: '6 oder mehr', eight: '8 oder mehr', ten: '10 oder mehr', twelve: '12' },
    budget: { any: 'Egal', under1000: 'Bis €1.000', mid: '€1.000 – €2.500', upper: '€2.500 – €5.000', top: 'Ab €5.000' },
    resultaat: (n) => `${n} Boote passen`,
  },
  es: {
    intro: 'Tres preguntas y la flota se reduce a los barcos que encajan.',
    step: (n) => `Paso ${n}`,
    soortTitle: '¿Qué tipo de barco?',
    soortHint: 'Una lancha para una cala y un baño; un yate desde 50 ft para todo el día y tripulación.',
    paxTitle: '¿Cuántos a bordo?',
    paxHint: 'Doce pasajeros es el máximo legal en un chárter aquí.',
    budgetTitle: '¿Presupuesto por día?',
    budgetHint: 'Tarifas diarias, sin combustible ni patrón salvo que el dossier diga lo contrario.',
    any: 'Indiferente',
    cat: { all: 'Indiferente', yacht: 'Yate', motorboat: 'Lancha', catamaran: 'Catamarán', jetski: 'Moto de agua', boat: 'Barco' },
    pax: { any: 'Indiferente', six: '6 o más', eight: '8 o más', ten: '10 o más', twelve: '12' },
    budget: { any: 'Indiferente', under1000: 'Hasta 1.000 €', mid: '1.000 € – 2.500 €', upper: '2.500 € – 5.000 €', top: 'Desde 5.000 €' },
    resultaat: (n) => `${n} barcos encajan`,
  },
  fr: {
    intro: 'Trois questions et la flotte se réduit aux bateaux qui conviennent.',
    step: (n) => `Étape ${n}`,
    soortTitle: 'Quel type de bateau ?',
    soortHint: "Un bateau à moteur pour une crique et une baignade ; un yacht dès 50 ft pour la journée et l'équipage.",
    paxTitle: 'Combien à bord ?',
    paxHint: 'Douze passagers est le maximum légal sur un charter ici.',
    budgetTitle: 'Budget par jour ?',
    budgetHint: 'Tarifs journaliers, hors carburant et skipper sauf mention au dossier.',
    any: 'Peu importe',
    cat: { all: 'Peu importe', yacht: 'Yacht', motorboat: 'Bateau à moteur', catamaran: 'Catamaran', jetski: 'Jet ski', boat: 'Bateau' },
    pax: { any: 'Peu importe', six: '6 ou plus', eight: '8 ou plus', ten: '10 ou plus', twelve: '12' },
    budget: { any: 'Peu importe', under1000: "Jusqu'à 1 000 €", mid: '1 000 € – 2 500 €', upper: '2 500 € – 5 000 €', top: 'À partir de 5 000 €' },
    resultaat: (n) => `${n} bateaux correspondent`,
  },
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
        active
          ? 'border-ibiza-green bg-ibiza-green text-white'
          : 'border-black/15 bg-white text-black/70 hover:border-black/40 hover:text-black'
      }`}
    >
      {active && <Check size={13} />}
      {children}
    </button>
  )
}

function Step({ n, icon, title, hint, children }: {
  n: number; icon: React.ReactNode; title: string; hint: string; children: React.ReactNode
}) {
  return (
    <div className="border-t border-black/10 pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ibiza-green/10 text-ibiza-green">{icon}</span>
        <h2 className="m-0 font-serif text-lg font-bold text-black">{title}</h2>
      </div>
      <p className="mt-1 mb-3 text-sm text-black/55">{hint}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export function FleetSteps({
  locale, soorten, category, setCategory, paxStep, setPaxStep, budgetStep, setBudgetStep, resultCount,
}: {
  locale: string
  /** Alleen de soorten die in de vloot voorkomen — zie FLEET_CATEGORIES. */
  soorten: FleetCategory[]
  category: FleetCategory | 'all'
  setCategory: (c: FleetCategory | 'all') => void
  paxStep: string
  setPaxStep: (k: string) => void
  budgetStep: string
  setBudgetStep: (k: string) => void
  resultCount: number
}) {
  const T = I18N[locale] || I18N.en
  const CATS: (FleetCategory | 'all')[] = ['all', ...soorten]

  return (
    <section className="mx-auto max-w-5xl px-4 pt-8">
      {/* Eigen lichte ondergrond: body is donker, en zonder achtergrond staat
          zwarte tekst hier op bijna zwart. Zie CLAUDE.md. */}
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <p className="m-0 mb-5 text-sm font-semibold uppercase tracking-widest text-black/45">{T.intro}</p>
        <div className="flex flex-col gap-4">
          <Step n={1} icon={<Ship size={14} />} title={T.soortTitle} hint={T.soortHint}>
            {CATS.map(c => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{T.cat[c]}</Chip>
            ))}
          </Step>
          <Step n={2} icon={<Users size={14} />} title={T.paxTitle} hint={T.paxHint}>
            {PAX_STEPS.map(s => (
              <Chip key={s.key} active={paxStep === s.key} onClick={() => setPaxStep(s.key)}>{T.pax[s.key]}</Chip>
            ))}
          </Step>
          <Step n={3} icon={<Euro size={14} />} title={T.budgetTitle} hint={T.budgetHint}>
            {BUDGET_STEPS.map(s => (
              <Chip key={s.key} active={budgetStep === s.key} onClick={() => setBudgetStep(s.key)}>{T.budget[s.key]}</Chip>
            ))}
          </Step>
        </div>
        <p className="m-0 mt-5 border-t border-black/10 pt-4 text-sm font-bold text-black">{T.resultaat(resultCount)}</p>
      </div>
    </section>
  )
}

export default FleetSteps
