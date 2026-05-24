'use client'

import { MessageCircle } from 'lucide-react'
import { useBooking } from '@/context/booking-context'
import type { Experience } from '@/types/experience'

interface ExperienceBookingCTAProps {
  experience: Experience
}

export function ExperienceBookingCTA({ experience }: ExperienceBookingCTAProps) {
  const { openModal } = useBooking()

  return (
    <button
      onClick={() =>
        openModal({
          serviceType: experience.category,
          serviceName: experience.title,
          sourcePage: `/experiences/${experience.slug}`,
        })
      }
      className="flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors hover:bg-rustic-terracotta/90"
    >
      <MessageCircle size={15} />
      Book via WhatsApp
    </button>
  )
}
