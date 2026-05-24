'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, Anchor, Ticket } from 'lucide-react'
import { useBooking } from '@/context/booking-context'
import { BookingForm } from './BookingForm'

const serviceIcons: Record<string, React.ReactNode> = {
  'private-boat-charter': <Anchor size={18} />,
  'club-tickets': <Ticket size={18} />,
  'boat-party': <Anchor size={18} />,
}

export function BookingModal() {
  const { isOpen, config, closeModal } = useBooking()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [successName, setSuccessName] = useState('')

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setStep('form')
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSuccess = (firstName: string) => {
    setSuccessName(firstName)
    setStep('success')
  }

  const icon = config ? serviceIcons[config.serviceType] ?? <Anchor size={18} /> : null

  return (
    <AnimatePresence>
      {isOpen && config && (
        /* Full-screen flex wrapper — centers the panel in both axes */
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-velvet-obsidian/70 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Enquire about ${config.serviceName}`}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-ibiza-sand shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-velvet-obsidian/10 px-6 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-rustic-terracotta">
                  {icon}
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-rustic-terracotta">
                    Enquire
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-light text-velvet-obsidian">
                  {config.clubName ? `${config.clubName}` : config.serviceName}
                </h2>
                {config.clubName && (
                  <p className="font-sans text-sm text-velvet-obsidian/50">{config.serviceName}</p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-velvet-obsidian/40 transition-colors hover:bg-velvet-obsidian/10 hover:text-velvet-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rustic-terracotta"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="mb-5 font-sans text-sm leading-relaxed text-velvet-obsidian/60">
                      Leave your details and we&apos;ll connect you on WhatsApp for instant booking confirmation.
                    </p>
                    <BookingForm config={config} onSuccess={handleSuccess} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-4 py-6 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rustic-terracotta/10 text-rustic-terracotta">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-serif text-3xl font-light text-velvet-obsidian">
                      Thank you, {successName}!
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-velvet-obsidian/60">
                      WhatsApp is now open. We&apos;ll confirm your booking within minutes.
                    </p>
                    <button
                      onClick={closeModal}
                      className="mt-2 rounded-full border border-velvet-obsidian/20 px-6 py-2.5 font-sans text-sm font-medium text-velvet-obsidian transition-colors hover:bg-velvet-obsidian hover:text-ibiza-sand"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
