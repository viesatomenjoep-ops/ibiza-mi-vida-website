'use client';
import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface EventTicketSelectorProps {
  id: string;
  title: string;
  date: string;
  priceStr: string;
  image?: string;
  affLink?: string;
}

export function EventTicketSelector({ id, title, date, priceStr, image, affLink }: EventTicketSelectorProps) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  
  // Extract number from price string like "55 € - 250 €" -> 55
  const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 50;

  const handleCheckout = () => {
    addToCart({
      serviceId: `ct_event_${id}`,
      title: `${title} Ticket`,
      price: numericPrice,
      date,
      image,
      quantity: qty
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full sm:w-auto">
      <div className="flex items-center justify-between sm:justify-end gap-3 bg-neutral-50 p-1.5 rounded-xl border border-black/5">
        <button 
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors text-black"
        >
          <Minus size={14} strokeWidth={3} />
        </button>
        <span className="font-bold text-sm w-4 text-center">{qty}</span>
        <button 
          onClick={() => setQty(qty + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors text-black"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
      <button 
        onClick={handleCheckout}
        className="bg-ibiza-green text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:bg-ibiza-sand hover:text-black hover:scale-105 whitespace-nowrap shadow-md flex items-center justify-center gap-2"
      >
        <ShoppingCart size={16} />
        Checkout
      </button>
    </div>
  );
}
