'use client'

import React from 'react'
import { Calendar, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { CTEventDate } from '@/lib/clubtickets'

interface Props {
  date: CTEventDate
  eventName: string
  venueName: string
  imageUrl: string
}

function parsePrice(priceStr?: string): number {
  if (!priceStr) return 50;
  const match = priceStr.match(/\d+([.,]\d+)?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 50;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function CTEventDateCard({ date, eventName, venueName, imageUrl }: Props) {
  const { addToCart, openDrawer } = useCart()

  const handleBook = () => {
    const priceNum = parsePrice(date.prices);
    addToCart({
      serviceId: String(date.id),
      title: eventName,
      price: priceNum,
      image: imageUrl,
      date: date.date
    });
    openDrawer();
  }

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col gap-3 transition-colors hover:border-gray-200">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-velvet-obsidian flex items-center gap-2">
          <Calendar size={16} className="text-rustic-terracotta" />
          {formatDate(date.date)}
        </span>
      </div>
      
      {date.lineUp && (
        <p className="text-sm text-gray-600 line-clamp-2" title={date.lineUp}>
          {date.lineUp}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200">
        <span className="font-serif font-semibold text-lg text-velvet-obsidian">
          {date.prices ? `From ${date.prices}` : 'Tickets available'}
        </span>
        <button 
          onClick={handleBook}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
        >
          Add to Cart
          <ShoppingCart size={14} />
        </button>
      </div>
    </div>
  )
}
