'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { BookingConfig } from '@/types/booking'

interface BookingContextValue {
  isOpen: boolean
  config: BookingConfig | null
  openModal: (config: BookingConfig) => void
  closeModal: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<BookingConfig | null>(null)

  const openModal = useCallback((cfg: BookingConfig) => {
    setConfig(cfg)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setConfig(null), 400)
  }, [])

  return (
    <BookingContext.Provider value={{ isOpen, config, openModal, closeModal }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
