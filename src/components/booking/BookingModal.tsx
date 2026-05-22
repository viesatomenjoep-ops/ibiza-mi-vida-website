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
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-midnight/70 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Enquire about ${config.serviceName}`}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed inset-x-4 top-1/2 z-[70] mx-auto max-w-lg -translate-y-1/2 rounded-3xl bg-soft-white shadow-2xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-midnight/10 px-6 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-teal">
                  {icon}
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-teal">
                    Enquire
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-light text-midnight">
                  {config.clubName ? `${config.clubName}` : config.serviceName}
                </h2>
                {config.clubName && (
                  <p className="font-sans text-sm text-midnight/50">{config.serviceName}</p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-midnight/40 transition-colors hover:bg-midnight/10 hover:text-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
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
                    <p className="mb-5 font-sans text-sm leading-relaxed text-midnight/60">
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-serif text-3xl font-light text-midnight">
                      Thank you, {successName}!
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-midnight/60">
                      WhatsApp is now open. We&apos;ll confirm your booking within minutes.
                    </p>
                    <button
                      onClick={closeModal}
                      className="mt-2 rounded-full border border-midnight/20 px-6 py-2.5 font-sans text-sm font-medium text-midnight transition-colors hover:bg-midnight hover:text-soft-white"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
