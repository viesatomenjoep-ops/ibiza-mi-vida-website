'use client'

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Heart,
  Users,
  Home,
  Plane,
  Sparkles,
  Car,
  Bike,
  CarTaxiFront,
  Ship,
  Utensils,
  Flower2,
  Martini,
  Umbrella,
  Check,
  ChevronLeft,
  Loader2,
  CalendarDays,
  KeyRound,
} from 'lucide-react'
import {
  type PlannerState,
  type Companionship,
  type Duration,
  type ArrivalMethod,
  type TransportOption,
  type VipExtra,
  initialPlannerState,
  createPlannerRecord,
  MOCK_VILLAS,
} from '@/lib/planner'

// ── State machine ──────────────────────────────────────────────────────

type StepId =
  | 'companionship'
  | 'duration'
  | 'lodging'
  | 'villa'
  | 'arrival'
  | 'transport'
  | 'transport_option'
  | 'extras'
  | 'review'

type Action =
  | { type: 'SET_COMPANIONSHIP'; value: Companionship }
  | { type: 'SET_DURATION'; value: Duration }
  | { type: 'SET_LODGING'; value: boolean }
  | { type: 'SET_VILLA'; value: string }
  | { type: 'SET_ARRIVAL'; value: ArrivalMethod }
  | { type: 'SET_TRANSPORT'; value: boolean }
  | { type: 'SET_TRANSPORT_OPTION'; value: TransportOption }
  | { type: 'TOGGLE_EXTRA'; value: VipExtra }

function plannerReducer(state: PlannerState, action: Action): PlannerState {
  switch (action.type) {
    case 'SET_COMPANIONSHIP':
      return { ...state, companionship: action.value }
    case 'SET_DURATION':
      return { ...state, duration: action.value }
    case 'SET_LODGING':
      return {
        ...state,
        hasLodging: action.value,
        selectedVilla: action.value ? null : state.selectedVilla,
      }
    case 'SET_VILLA':
      return { ...state, selectedVilla: action.value }
    case 'SET_ARRIVAL':
      return { ...state, arrivalMethod: action.value }
    case 'SET_TRANSPORT':
      return {
        ...state,
        hasTransport: action.value,
        transportOption: action.value ? null : state.transportOption,
      }
    case 'SET_TRANSPORT_OPTION':
      return { ...state, transportOption: action.value }
    case 'TOGGLE_EXTRA':
      return {
        ...state,
        extras: state.extras.includes(action.value)
          ? state.extras.filter((e) => e !== action.value)
          : [...state.extras, action.value],
      }
  }
}

/** The ordered flow, with conditional branches resolved from state. */
function buildFlow(state: PlannerState): StepId[] {
  const flow: StepId[] = ['companionship', 'duration', 'lodging']
  if (state.hasLodging === false) flow.push('villa')
  flow.push('arrival', 'transport')
  if (state.hasTransport === false) flow.push('transport_option')
  flow.push('extras', 'review')
  return flow
}

// ── Shared UI atoms ────────────────────────────────────────────────────

function OptionCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-3 rounded-2xl border px-6 py-7 text-center transition-all duration-300 ${
        selected
          ? 'border-gold bg-gold-faint shadow-[0_0_30px_rgba(212,175,55,0.15)]'
          : 'border-white/10 bg-obsidian-card hover:border-gold/50 hover:bg-white/[0.03]'
      }`}
    >
      <span
        className={`transition-colors duration-300 ${
          selected ? 'text-gold' : 'text-white/40 group-hover:text-gold-soft'
        }`}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold tracking-wide text-white">{title}</span>
      {subtitle && <span className="text-xs font-light text-white/50">{subtitle}</span>}
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-obsidian">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

function StepShell({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
        {kicker}
      </p>
      <h3 className="mb-8 text-2xl font-light leading-snug text-white md:text-3xl">{title}</h3>
      {children}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────

export default function IbizaPlanner({ locale = 'nl' }: { locale?: string }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(plannerReducer, initialPlannerState)
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flow = useMemo(() => buildFlow(state), [state])
  const step = flow[Math.min(stepIndex, flow.length - 1)] ?? flow[0]
  const progress = ((stepIndex + 1) / flow.length) * 100

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  // Keep the cursor valid when conditional steps are added or removed.
  useEffect(() => {
    setStepIndex((i) => Math.min(i, flow.length - 1))
  }, [flow.length])

  const goToIndex = (index: number, dir: 1 | -1) => {
    setDirection(dir)
    setStepIndex(Math.max(0, Math.min(index, flow.length - 1)))
  }

  const goNext = () => goToIndex(stepIndex + 1, 1)
  const goBack = () => goToIndex(stepIndex - 1, -1)

  /** Select an option and auto-advance for single-choice steps. */
  const pick = (action: Action) => {
    const nextState = plannerReducer(state, action)
    const currentStep = flow[stepIndex]
    const nextFlow = buildFlow(nextState)
    const nextIndex = Math.min(
      nextFlow.indexOf(currentStep) + 1,
      nextFlow.length - 1
    )

    dispatch(action)

    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => {
      goToIndex(nextIndex, 1)
    }, 280)
  }

  const handleSubmit = () => {
    setSubmitting(true)
    const record = createPlannerRecord(state)
    setTimeout(() => {
      router.push(`/${locale}/planner/${record.uuid}`)
    }, 1400)
  }

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
  }

  return (
    <section
      id="ibiza-planner"
      className="font-montserrat relative w-full scroll-mt-[calc(var(--nav-h,72px)+1rem)] overflow-hidden bg-obsidian py-20 text-white md:py-28"
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #8B6FB0, transparent)' }}
      />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-serif text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-soft">
            Ibiza Mi Vida — VIP Concierge
          </p>
          <h2 className="font-serif text-3xl font-light tracking-tight text-white md:text-5xl">
            Start Your <span className="font-semibold text-gold">Ibiza Planner</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-white/50">
            Answer a few questions and receive your private planner link — your entire
            trip, arranged to perfection.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-widest text-white/40">
            <span>
              Step {stepIndex + 1} <span className="text-white/25">/ {flow.length}</span>
            </span>
            <span className="text-gold-soft">{Math.round(progress)}%</span>
          </div>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-soft to-gold"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 'companionship' && (
                <StepShell kicker="Your party" title="Who are you travelling with?">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <OptionCard
                      selected={state.companionship === 'couple'}
                      onClick={() => pick({ type: 'SET_COMPANIONSHIP', value: 'couple' })}
                      icon={<Heart size={28} strokeWidth={1.5} />}
                      title="Couple"
                      subtitle="Romantic escape"
                    />
                    <OptionCard
                      selected={state.companionship === 'friends'}
                      onClick={() => pick({ type: 'SET_COMPANIONSHIP', value: 'friends' })}
                      icon={<Martini size={28} strokeWidth={1.5} />}
                      title="Friends Group"
                      subtitle="The full experience"
                    />
                    <OptionCard
                      selected={state.companionship === 'family'}
                      onClick={() => pick({ type: 'SET_COMPANIONSHIP', value: 'family' })}
                      icon={<Users size={28} strokeWidth={1.5} />}
                      title="Family"
                      subtitle="Relaxed & refined"
                    />
                  </div>
                </StepShell>
              )}

              {step === 'duration' && (
                <StepShell kicker="Duration" title="How long will you stay?">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {(['3', '5', '7', '10+'] as Duration[]).map((d) => (
                      <OptionCard
                        key={d}
                        selected={state.duration === d}
                        onClick={() => pick({ type: 'SET_DURATION', value: d })}
                        icon={<CalendarDays size={26} strokeWidth={1.5} />}
                        title={`${d} Days`}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 'lodging' && (
                <StepShell kicker="Accommodation" title="Do you already have a stay arranged?">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OptionCard
                      selected={state.hasLodging === true}
                      onClick={() => pick({ type: 'SET_LODGING', value: true })}
                      icon={<KeyRound size={28} strokeWidth={1.5} />}
                      title="Yes, all set"
                      subtitle="Villa or hotel booked"
                    />
                    <OptionCard
                      selected={state.hasLodging === false}
                      onClick={() => pick({ type: 'SET_LODGING', value: false })}
                      icon={<Home size={28} strokeWidth={1.5} />}
                      title="Not yet"
                      subtitle="Show me exclusive villas"
                    />
                  </div>
                </StepShell>
              )}

              {step === 'villa' && (
                <StepShell kicker="Villa catalogue" title="Select your villa.">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {MOCK_VILLAS.map((villa) => {
                      const selected = state.selectedVilla === villa.slug
                      return (
                        <button
                          key={villa.slug}
                          type="button"
                          onClick={() => pick({ type: 'SET_VILLA', value: villa.slug })}
                          className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                            selected
                              ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                              : 'border-white/10 hover:border-gold/50'
                          }`}
                        >
                          <div className="relative h-36 w-full overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={villa.image}
                              alt={villa.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                            {selected && (
                              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-obsidian">
                                <Check size={13} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <div className="bg-obsidian-card p-4">
                            <p className="text-sm font-semibold text-white">{villa.name}</p>
                            <p className="mt-0.5 text-xs font-light text-white/50">
                              {villa.area} · {villa.bedrooms} bedrooms
                            </p>
                            <p className="mt-2 text-xs font-medium text-gold">
                              from €{villa.pricePerNight.toLocaleString('en-US')} / night
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </StepShell>
              )}

              {step === 'arrival' && (
                <StepShell kicker="Arrival" title="How will you arrive on the island?">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OptionCard
                      selected={state.arrivalMethod === 'commercial'}
                      onClick={() => pick({ type: 'SET_ARRIVAL', value: 'commercial' })}
                      icon={<Plane size={28} strokeWidth={1.5} />}
                      title="Commercial Flight"
                      subtitle="We track your arrival"
                    />
                    <OptionCard
                      selected={state.arrivalMethod === 'private_jet'}
                      onClick={() => pick({ type: 'SET_ARRIVAL', value: 'private_jet' })}
                      icon={<Sparkles size={28} strokeWidth={1.5} />}
                      title="Private Jet"
                      subtitle="VIP terminal reception"
                    />
                  </div>
                </StepShell>
              )}

              {step === 'transport' && (
                <StepShell kicker="On the island" title="Do you already have transport arranged?">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OptionCard
                      selected={state.hasTransport === true}
                      onClick={() => pick({ type: 'SET_TRANSPORT', value: true })}
                      icon={<Check size={28} strokeWidth={1.5} />}
                      title="Yes, arranged"
                    />
                    <OptionCard
                      selected={state.hasTransport === false}
                      onClick={() => pick({ type: 'SET_TRANSPORT', value: false })}
                      icon={<Car size={28} strokeWidth={1.5} />}
                      title="Not yet"
                      subtitle="Show me the options"
                    />
                  </div>
                </StepShell>
              )}

              {step === 'transport_option' && (
                <StepShell kicker="Transport" title="Choose your ride.">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <OptionCard
                      selected={state.transportOption === 'vip_van'}
                      onClick={() => pick({ type: 'SET_TRANSPORT_OPTION', value: 'vip_van' })}
                      icon={<Car size={28} strokeWidth={1.5} />}
                      title="VIP Mercedes V-Class Van"
                      subtitle="Private chauffeur, all week"
                    />
                    <OptionCard
                      selected={state.transportOption === 'taxi'}
                      onClick={() => pick({ type: 'SET_TRANSPORT_OPTION', value: 'taxi' })}
                      icon={<CarTaxiFront size={28} strokeWidth={1.5} />}
                      title="Taxi"
                      subtitle="Reliable, pre-booked"
                    />
                    <OptionCard
                      selected={state.transportOption === 'car_rental'}
                      onClick={() => pick({ type: 'SET_TRANSPORT_OPTION', value: 'car_rental' })}
                      icon={<Car size={28} strokeWidth={1.5} />}
                      title="Premium Car Rental"
                      subtitle="Delivered to your villa"
                    />
                    <OptionCard
                      selected={state.transportOption === 'scooter'}
                      onClick={() => pick({ type: 'SET_TRANSPORT_OPTION', value: 'scooter' })}
                      icon={<Bike size={28} strokeWidth={1.5} />}
                      title="Scooter Rental"
                      subtitle="Freedom of the island"
                    />
                  </div>
                </StepShell>
              )}

              {step === 'extras' && (
                <StepShell
                  kicker="The finishing touch"
                  title="Any VIP experiences we should arrange?"
                >
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {(
                      [
                        ['beach_clubs', 'Beach Clubs', <Umbrella key="i" size={26} strokeWidth={1.5} />],
                        ['vip_tables', 'VIP Club Tables', <Martini key="i" size={26} strokeWidth={1.5} />],
                        ['boat_charter', 'Private Boat Charter', <Ship key="i" size={26} strokeWidth={1.5} />],
                        ['massage', 'In-Villa Massages', <Flower2 key="i" size={26} strokeWidth={1.5} />],
                        ['private_chef', 'Private Chef', <Utensils key="i" size={26} strokeWidth={1.5} />],
                      ] as [VipExtra, string, React.ReactNode][]
                    ).map(([value, label, icon]) => (
                      <OptionCard
                        key={value}
                        selected={state.extras.includes(value)}
                        onClick={() => dispatch({ type: 'TOGGLE_EXTRA', value })}
                        icon={icon}
                        title={label}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-obsidian transition-all hover:bg-gold-soft hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"
                    >
                      {state.extras.length > 0
                        ? `Continue with ${state.extras.length} experience${state.extras.length > 1 ? 's' : ''}`
                        : 'Skip — continue'}
                    </button>
                  </div>
                </StepShell>
              )}

              {step === 'review' && (
                <StepShell kicker="Almost there" title="Your bespoke Ibiza plan.">
                  <ReviewSummary state={state} />
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="inline-flex items-center gap-3 rounded-full bg-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-obsidian transition-all hover:bg-gold-soft hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Generating your private link…
                        </>
                      ) : (
                        <>Generate My Private Planner</>
                      )}
                    </button>
                    <p className="mt-4 text-xs font-light text-white/40">
                      You&apos;ll receive a secure, personal dashboard with your full itinerary.
                    </p>
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back button */}
        {stepIndex > 0 && !submitting && (
          <button
            type="button"
            onClick={goBack}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-white/40 transition-colors hover:text-gold"
          >
            <ChevronLeft size={14} /> Back
          </button>
        )}
      </div>
    </section>
  )
}

// ── Review summary ─────────────────────────────────────────────────────

function ReviewSummary({ state }: { state: PlannerState }) {
  const villa = MOCK_VILLAS.find((v) => v.slug === state.selectedVilla)
  const rows: [string, string][] = [
    [
      'Party',
      state.companionship === 'couple'
        ? 'Couple'
        : state.companionship === 'friends'
          ? 'Friends Group'
          : state.companionship === 'family'
            ? 'Family'
            : '—',
    ],
    ['Duration', state.duration ? `${state.duration} days` : '—'],
    [
      'Stay',
      state.hasLodging
        ? 'Own accommodation'
        : villa
          ? `${villa.name} — ${villa.area}`
          : 'Villa to be selected',
    ],
    ['Arrival', state.arrivalMethod === 'private_jet' ? 'Private Jet' : state.arrivalMethod === 'commercial' ? 'Commercial Flight' : '—'],
    [
      'Transport',
      state.hasTransport
        ? 'Own transport'
        : state.transportOption === 'vip_van'
          ? 'VIP Mercedes V-Class Van'
          : state.transportOption === 'taxi'
            ? 'Taxi'
            : state.transportOption === 'car_rental'
              ? 'Premium Car Rental'
              : state.transportOption === 'scooter'
                ? 'Scooter Rental'
                : '—',
    ],
    [
      'VIP Experiences',
      state.extras.length
        ? state.extras
            .map(
              (e) =>
                ({
                  beach_clubs: 'Beach Clubs',
                  vip_tables: 'VIP Club Tables',
                  boat_charter: 'Private Boat Charter',
                  massage: 'In-Villa Massages',
                  private_chef: 'Private Chef',
                })[e]
            )
            .join(', ')
        : 'None selected',
    ],
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-obsidian-card">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={`flex items-start justify-between gap-6 px-6 py-4 ${
            i > 0 ? 'border-t border-white/[0.06]' : ''
          }`}
        >
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
            {label}
          </span>
          <span className="text-right text-sm font-light text-white/85">{value}</span>
        </div>
      ))}
    </div>
  )
}
