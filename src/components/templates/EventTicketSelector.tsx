'use client';
import { ExternalLink } from 'lucide-react';

interface EventTicketSelectorProps {
  id: string;
  title: string;
  date: string;
  priceStr: string;
  image?: string;
  affLink?: string;
}

export function EventTicketSelector({ affLink }: EventTicketSelectorProps) {
  const handleCheckout = () => {
    if (affLink) window.open(affLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-ibiza-green text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:brightness-95 hover:scale-105 whitespace-nowrap shadow-md flex items-center justify-center gap-2"
    >
      Tickets
      <ExternalLink size={16} />
    </button>
  );
}
