'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export function WhatsAppFAB() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34XXXXXXXXX'
  const href = `https://wa.me/${phone}?text=${encodeURIComponent("Hi Ibiza mi vida! I'd like to know more about your services.")}`

  return (
    <div
      className="fixed bottom-24 right-4 z-50 lg:bottom-8 lg:right-8"
      aria-label="WhatsApp chat"
    >
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-rustic-terracotta"
        animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Button */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-rustic-terracotta text-white shadow-lg shadow-rustic-terracotta/30 transition-colors hover:bg-rustic-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rustic-terracotta focus-visible:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={26} strokeWidth={1.75} />
      </motion.a>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 hidden whitespace-nowrap rounded-full bg-velvet-obsidian px-3 py-1.5 font-sans text-xs text-ibiza-sand shadow-md lg:block"
      >
        Chat on WhatsApp
      </motion.div>
    </div>
  )
}
