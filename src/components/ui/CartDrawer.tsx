'use client'

import React, { useMemo } from 'react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { optImg } from '@/lib/img';

const CONFIG = {
  whatsapp: '33666528412',
};

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeFromCart, updateQuantity, totalPrice } = useCart();

  const waLink = useMemo(() => {
    if (items.length === 0) return '#';
    const lines = items.map(d => `• ${d.quantity}x ${d.title} ${d.date ? `(${d.date})` : ''} — €${d.price * d.quantity}`).join('\n');
    const msg = `Hi Ibiza Mi Vida! I'd like to book:\n${lines}\n\nTotal: €${totalPrice}`;
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [items, totalPrice]);

  if (!isDrawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold font-serif">Your Cart</h2>
          <button onClick={closeDrawer} className="text-gray-400 hover:text-black transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
                {item.image ? (
                  <img src={optImg(item.image, 150)} loading="lazy" alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 leading-tight">{item.title}</h3>
                  {item.date && <p className="text-sm text-gray-500 mt-1">{item.date}</p>}
                  <p className="font-bold mt-1">€{item.price * item.quantity}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-sm">
                    Remove
                  </button>
                  <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-black disabled:opacity-30" disabled={item.quantity <= 1}>-</button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-black">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-2xl font-bold font-serif">€{totalPrice}</span>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/checkout" onClick={closeDrawer} className="w-full bg-black text-white text-center py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Direct Checkout
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-full font-semibold hover:bg-[#128C7E] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5 0-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z"/>
                </svg>
                Book via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
