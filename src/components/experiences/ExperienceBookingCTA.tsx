'use client'

import { useCart } from '@/context/cart-context'
import type { Experience } from '@/types/experience'

interface ExperienceBookingCTAProps {
  experience: Experience
}

export function ExperienceBookingCTA({ experience }: ExperienceBookingCTAProps) {
  const { addToCart, openDrawer } = useCart()

  return (
    <button
      onClick={() => {
        addToCart({
          serviceId: `experience-${experience.id}`,
          title: experience.title,
          price: experience.price_from || 0,
          image: experience.image_url ?? '/fotos/hero-pattern.jpg',
          date: undefined
        });
        openDrawer();
      }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-rustic-terracotta px-6 py-3.5 font-sans text-base font-semibold text-white transition-colors hover:bg-rustic-terracotta/90"
    >
      Add to Cart
    </button>
  )
}
