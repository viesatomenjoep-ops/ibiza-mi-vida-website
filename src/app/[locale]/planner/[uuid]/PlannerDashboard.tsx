'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plane,
  Car,
  Home,
  Ship,
  Martini,
  Umbrella,
  Utensils,
  Flower2,
  FileDown,
  Sun,
  Moon,
  MessageCircle,
  X,
  Send,
  ShieldCheck,
  Sparkles,
  MapPin,
} from 'lucide-react'
import {
  type PlannerRecord,
  type VipExtra,
  loadPlannerRecord,
  demoPlannerRecord,
  DURATION_DAYS,
  COMPANIONSHIP_LABELS,
  ARRIVAL_LABELS,
  TRANSPORT_LABELS,
  EXTRA_LABELS,
  MOCK_VILLAS,
} from '@/lib/planner'

// ── Mock PDF generation ────────────────────────────────────────────────
// Builds a tiny but valid one-page PDF so the "download voucher" buttons
// deliver a real file — the future backend swaps this for server-rendered
// branded PDFs.

function buildVoucherPdf(title: string, lines: string[]): Blob {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  let text = `BT /F1 20 Tf 60 760 Td (IBIZA MI VIDA  -  VIP CONCIERGE) Tj ET\n`
  text += `BT /F1 14 Tf 60 720 Td (${esc(title)}) Tj ET\n`
  lines.forEach((line, i) => {
    text += `BT /F1 10 Tf 60 ${690 - i * 20} Td (${esc(line)}) Tj ET\n`
  })
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${text.length} >>\nstream\n${text}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((obj, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

function downloadVoucher(title: string, lines: string[]) {
  const blob = buildVoucherPdf(title, lines)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Itinerary generation ───────────────────────────────────────────────

interface TimelineItem {
  time: string
  title: string
  detail: string
  icon: React.ReactNode
  gold?: boolean
}

const EXTRA_ICONS: Record<VipExtra, React.ReactNode> = {
  beach_clubs: <Umbrella size={16} strokeWidth={1.75} />,
  vip_tables: <Martini size={16} strokeWidth={1.75} />,
  boat_charter: <Ship size={16} strokeWidth={1.75} />,
  massage: <Flower2 size={16} strokeWidth={1.75} />,
  private_chef: <Utensils size={16} strokeWidth={1.75} />,
}

function buildItinerary(record: PlannerRecord): { day: number; label: string; items: TimelineItem[] }[] {
  const { data } = record
  const days = DURATION_DAYS[data.duration || '5']
  const villa = MOCK_VILLAS.find((v) => v.slug === data.selectedVilla)
  const stayName = data.hasLodging ? 'your accommodation' : villa ? villa.name : 'your villa'
  const transport = data.hasTransport
    ? 'your own transport'
    : TRANSPORT_LABELS[data.transportOption || 'vip_van']

  const result: { day: number; label: string; items: TimelineItem[] }[] = []

  for (let day = 1; day <= days; day++) {
    const items: TimelineItem[] = []

    if (day === 1) {
      items.push(
        {
          time: '14:20',
          title:
            data.arrivalMethod === 'private_jet'
              ? 'Private Jet Arrival — VIP Terminal'
              : 'Arrival — Ibiza Airport (IBZ)',
          detail:
            data.arrivalMethod === 'private_jet'
              ? 'Fast-track reception at the private aviation terminal. Your host awaits planeside.'
              : 'Meet & greet at arrivals — look for the gold Ibiza Mi Vida sign.',
          icon: <Plane size={16} strokeWidth={1.75} />,
          gold: true,
        },
        {
          time: '14:45',
          title: `Transfer via ${transport}`,
          detail: `Chilled cava on board. Direct route to ${stayName}.`,
          icon: <Car size={16} strokeWidth={1.75} />,
        },
        {
          time: '15:30',
          title: `Check-in — ${stayName}`,
          detail: villa
            ? `${villa.area} · ${villa.bedrooms} bedrooms · infinity pool prepared on arrival.`
            : 'Luggage handled. Welcome amenities waiting.',
          icon: <Home size={16} strokeWidth={1.75} />,
        },
        {
          time: '20:30',
          title: 'Welcome Dinner — Sunset Side',
          detail: 'Reserved table at a cliffside restaurant. Confirmation in your vouchers below.',
          icon: <Sun size={16} strokeWidth={1.75} />,
        }
      )
    } else if (day === days) {
      items.push(
        {
          time: '10:00',
          title: 'Late Breakfast & Pool Morning',
          detail: 'Slow final morning. Your concierge confirms the departure logistics.',
          icon: <Sun size={16} strokeWidth={1.75} />,
        },
        {
          time: '13:00',
          title: `Departure Transfer via ${transport}`,
          detail: 'Luggage collected from your suite. Airport drop-off with time to spare.',
          icon: <Plane size={16} strokeWidth={1.75} />,
          gold: true,
        }
      )
    } else {
      // Middle days — rotate the selected VIP extras through the itinerary
      const extras = record.data.extras
      const extra = extras.length ? extras[(day - 2) % extras.length] : null

      items.push({
        time: '10:30',
        title: 'Slow Morning at the Villa',
        detail: 'Fresh breakfast delivery. Pool, sun and absolutely no agenda.',
        icon: <Sun size={16} strokeWidth={1.75} />,
      })

      if (extra) {
        const detailMap: Record<VipExtra, string> = {
          beach_clubs: 'Front-row daybeds reserved — Cala Bassa Beach Club. Voucher below.',
          vip_tables: 'Your VIP table is confirmed. Host meets you at the door — skip every queue.',
          boat_charter: 'Private charter from Marina Botafoch. Skipper, fuel and drinks included.',
          massage: 'In-villa spa session for the whole party. Therapists arrive at your terrace.',
          private_chef: 'Private chef takes over your kitchen tonight — menu tailored to your party.',
        }
        items.push({
          time: extra === 'vip_tables' ? '23:30' : '13:00',
          title: EXTRA_LABELS[extra],
          detail: detailMap[extra],
          icon: EXTRA_ICONS[extra],
          gold: true,
        })
      } else {
        items.push({
          time: '13:30',
          title: 'Island Exploration',
          detail: 'Curated route: hidden calas, Es Vedrà viewpoint and a long lazy lunch.',
          icon: <MapPin size={16} strokeWidth={1.75} />,
        })
      }

      items.push({
        time: '21:00',
        title: day % 2 === 0 ? 'Dinner Reservation — Old Town' : 'Sunset Apéritif',
        detail:
          day % 2 === 0
            ? 'Table secured at one of Dalt Vila\u2019s finest. Dress code: effortless.'
            : 'Golden hour drinks on the west coast, arranged and pre-paid.',
        icon: <Moon size={16} strokeWidth={1.75} />,
      })
    }

    result.push({
      day,
      label: day === 1 ? 'Arrival Day' : day === days ? 'Departure Day' : `Day ${day}`,
      items,
    })
  }
  return result
}

// ── Vouchers ───────────────────────────────────────────────────────────

interface Voucher {
  id: string
  title: string
  subtitle: string
  ref: string
  icon: React.ReactNode
  lines: string[]
}

function buildVouchers(record: PlannerRecord): Voucher[] {
  const { data, uuid } = record
  const short = uuid.slice(0, 8).toUpperCase()
  const villa = MOCK_VILLAS.find((v) => v.slug === data.selectedVilla)
  const vouchers: Voucher[] = []

  if (!data.hasLodging && villa) {
    vouchers.push({
      id: 'villa',
      title: 'Villa Reservation Confirmation',
      subtitle: `${villa.name} — ${villa.area}`,
      ref: `IMV-VLL-${short}`,
      icon: <Home size={20} strokeWidth={1.5} />,
      lines: [
        `Reference: IMV-VLL-${short}`,
        `Property: ${villa.name}, ${villa.area}`,
        `Bedrooms: ${villa.bedrooms} - Check-in from 15:00`,
        'Concierge on call 24/7 via your private dashboard.',
      ],
    })
  }

  if (!data.hasTransport && data.transportOption) {
    vouchers.push({
      id: 'transport',
      title:
        data.transportOption === 'vip_van'
          ? 'VIP Van Transfer Confirmation'
          : `${TRANSPORT_LABELS[data.transportOption]} Confirmation`,
      subtitle: TRANSPORT_LABELS[data.transportOption],
      ref: `IMV-TRN-${short}`,
      icon: <Car size={20} strokeWidth={1.5} />,
      lines: [
        `Reference: IMV-TRN-${short}`,
        `Service: ${TRANSPORT_LABELS[data.transportOption]}`,
        'Pickup: Ibiza Airport (IBZ) on arrival - driver tracks your flight.',
        'Present this voucher (digital is fine) to your driver.',
      ],
    })
  }

  vouchers.push({
    id: 'arrival',
    title:
      data.arrivalMethod === 'private_jet'
        ? 'Private Aviation VIP Reception'
        : 'Airport Meet & Greet Voucher',
    subtitle: ARRIVAL_LABELS[data.arrivalMethod || 'commercial'],
    ref: `IMV-ARR-${short}`,
    icon: <Plane size={20} strokeWidth={1.5} />,
    lines: [
      `Reference: IMV-ARR-${short}`,
      `Arrival: ${ARRIVAL_LABELS[data.arrivalMethod || 'commercial']}`,
      'Your host will be waiting with a gold Ibiza Mi Vida sign.',
      'Emergency line: available in your AI assistant, 24/7.',
    ],
  })

  const extraVoucherTitles: Record<VipExtra, string> = {
    beach_clubs: 'Beach Club Daybeds Voucher',
    vip_tables: 'VIP Club Table Confirmation',
    boat_charter: 'Private Yacht Charter Voucher',
    massage: 'In-Villa Spa Session Voucher',
    private_chef: 'Private Chef Experience Voucher',
  }
  data.extras.forEach((extra) => {
    vouchers.push({
      id: extra,
      title: extraVoucherTitles[extra],
      subtitle: EXTRA_LABELS[extra],
      ref: `IMV-${extra.slice(0, 3).toUpperCase()}-${short}`,
      icon: EXTRA_ICONS[extra],
      lines: [
        `Reference: IMV-${extra.slice(0, 3).toUpperCase()}-${short}`,
        `Experience: ${EXTRA_LABELS[extra]}`,
        'Dates and timings as per your day-to-day itinerary.',
        'Adjustments? Message your 24/7 AI assistant anytime.',
      ],
    })
  })

  return vouchers
}

// ── AI Assistant (mock) ────────────────────────────────────────────────

const AI_REPLIES = [
  'Of course — I\u2019ve noted that. Your concierge will confirm within minutes. Anything else for tonight?',
  'Great choice. I\u2019m checking live availability with our island partners now — you\u2019ll see it appear in your itinerary shortly.',
  'Done. I\u2019ve also arranged a backup option in case the weather turns — you\u2019ll find both in your dashboard.',
  'Consider it handled. Tip: ask me about the secret sunset spot near Cala d\u2019Hort before Thursday.',
]

function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: 'ai' | 'user'; text: string }[]>([
    {
      from: 'ai',
      text: 'Buenas! I\u2019m your 24/7 Ibiza personal assistant. Restaurant bookings, itinerary changes, local tips or urgent help — just ask.',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  const send = () => {
    const text = input.trim()
    if (!text || typing) return
    setMessages((m) => [...m, { from: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: 'ai', text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] },
      ])
      setTyping(false)
    }, 1300)
  }

  return (
    <div className="font-montserrat fixed bottom-5 right-5 z-[120]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-4 flex h-[440px] w-[calc(100vw-40px)] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-gold/30 bg-obsidian-light shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-obsidian px-4 py-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold-faint text-gold">
                <Sparkles size={16} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-obsidian bg-emerald-400" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">AI Personal Assistant</p>
                <p className="text-[11px] font-light text-gold-soft">24/7 · replies instantly</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 transition-colors hover:text-white"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-gold text-obsidian'
                        : 'rounded-bl-sm border border-white/10 bg-white/[0.05] text-white/90'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-soft"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 bg-obsidian px-3 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything — bookings, tips, help…"
                className="flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
              />
              <button
                onClick={send}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-obsidian transition-all hover:bg-gold-soft"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-obsidian shadow-[0_10px_35px_rgba(139,111,176,0.45)]"
        aria-label="Open 24/7 AI assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </div>
  )
}

// ── Dashboard page ─────────────────────────────────────────────────────

export default function PlannerDashboard({ uuid, locale }: { uuid: string; locale: string }) {
  const [record, setRecord] = useState<PlannerRecord | null>(null)

  // localStorage is only available client-side; fall back to a demo record
  useEffect(() => {
    setRecord(loadPlannerRecord(uuid) ?? demoPlannerRecord(uuid))
  }, [uuid])

  const itinerary = useMemo(() => (record ? buildItinerary(record) : []), [record])
  const vouchers = useMemo(() => (record ? buildVouchers(record) : []), [record])

  if (!record) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    )
  }

  const { data } = record
  const villa = MOCK_VILLAS.find((v) => v.slug === data.selectedVilla)

  return (
    <div className="font-montserrat min-h-screen bg-obsidian pb-32 text-white">
      {/* ── Header ── */}
      <header className="relative overflow-hidden border-b border-white/[0.06] px-6 pb-14 pt-28 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[560px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #8B6FB0, transparent)' }}
        />
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-faint px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              <ShieldCheck size={13} /> Private Planner Link
            </div>
            <h1 className="text-3xl font-light tracking-tight md:text-5xl">
              Your Ibiza, <span className="font-semibold text-gold">Perfectly Arranged</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/50">
              {COMPANIONSHIP_LABELS[data.companionship || 'friends']} ·{' '}
              {DURATION_DAYS[data.duration || '5']} days ·{' '}
              {ARRIVAL_LABELS[data.arrivalMethod || 'commercial']}
              {villa ? ` · ${villa.name}` : ''}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-wider text-white/25">
              Secure ID&nbsp;&nbsp;{uuid}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* ── Day-to-day timeline ── */}
        <section className="py-14">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="shrink-0 text-xl font-light md:text-2xl">
              Day-to-Day <span className="font-semibold text-gold">Itinerary</span>
            </h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-10">
            {itinerary.map((day, di) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: Math.min(di * 0.05, 0.3) }}
                className="grid grid-cols-[64px_1fr] gap-5 md:grid-cols-[96px_1fr] md:gap-8"
              >
                {/* Day marker */}
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-soft">
                    Day
                  </p>
                  <p className="text-3xl font-light text-white md:text-4xl">
                    {String(day.day).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-[10px] font-light uppercase tracking-widest text-white/35">
                    {day.label}
                  </p>
                </div>

                {/* Items */}
                <div className="relative space-y-4 border-l border-white/10 pb-2 pl-6 md:pl-8">
                  {day.items.map((item, ii) => (
                    <div
                      key={ii}
                      className={`relative rounded-xl border px-5 py-4 transition-colors ${
                        item.gold
                          ? 'border-gold/30 bg-gold-faint'
                          : 'border-white/[0.07] bg-obsidian-card hover:border-white/15'
                      }`}
                    >
                      {/* Timeline dot */}
                      <span
                        className={`absolute -left-6 top-6 h-2 w-2 -translate-x-1/2 rounded-full md:-left-8 ${
                          item.gold ? 'bg-gold shadow-[0_0_10px_rgba(139,111,176,0.8)]' : 'bg-white/30'
                        }`}
                      />
                      <div className="flex items-start gap-4">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            item.gold ? 'bg-gold/20 text-gold' : 'bg-white/[0.06] text-white/50'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-mono text-[11px] tracking-wider text-gold-soft">
                              {item.time}
                            </span>
                            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          </div>
                          <p className="mt-1 text-[13px] font-light leading-relaxed text-white/50">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Vouchers ── */}
        <section className="py-6">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="shrink-0 text-xl font-light md:text-2xl">
              Your <span className="font-semibold text-gold">Vouchers</span> &amp; Confirmations
            </h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-card p-6 transition-all hover:border-gold/40"
              >
                {/* Perforation accent */}
                <div className="absolute inset-x-6 top-[72px] border-t border-dashed border-white/10" />

                <div className="mb-6 flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-faint text-gold">
                    {v.icon}
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white/40">
                    {v.ref}
                  </span>
                </div>

                <h3 className="text-sm font-semibold leading-snug text-white">{v.title}</h3>
                <p className="mt-1 text-xs font-light text-white/45">{v.subtitle}</p>

                <button
                  onClick={() => downloadVoucher(v.title, v.lines)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-obsidian"
                >
                  <FileDown size={14} /> Download PDF
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Concierge note ── */}
        <section className="mt-14 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold-faint to-transparent p-8 text-center md:p-12">
          <Sparkles className="mx-auto mb-4 text-gold" size={24} strokeWidth={1.5} />
          <h3 className="text-lg font-light md:text-xl">
            Anything missing? Your concierge is <span className="font-semibold text-gold">24/7 stand-by</span>.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-white/50">
            Use the assistant in the corner for instant changes, restaurant bookings, local tips
            or urgent help — day and night, in your language.
          </p>
        </section>
      </main>

      <AiAssistant />
    </div>
  )
}
