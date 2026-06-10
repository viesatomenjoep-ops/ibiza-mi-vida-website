'use client'

import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      clearCart();
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for booking with Ibiza Mi Vida. You will receive a confirmation email and WhatsApp message shortly.
          </p>
          <Link href="/" className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Your cart is empty</h1>
          <Link href="/" className="inline-block bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>
          <form onSubmit={handleCheckout} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            
            {/* Contact Details */}
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input required type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none" placeholder="+31 6 12345678" />
                </div>
              </div>
            </div>

            {/* Payment Method (Mock) */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-black rounded-xl cursor-pointer bg-gray-50">
                  <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-black" />
                  <span className="font-medium">iDEAL</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="payment" className="w-5 h-5" />
                  <span className="font-medium">Credit Card (Stripe)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="payment" className="w-5 h-5" />
                  <span className="font-medium">Apple Pay / Google Pay</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'processing'}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {status === 'processing' ? 'Processing...' : `Pay €${totalPrice}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
            <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 leading-tight">{item.title}</h3>
                    {item.date && <p className="text-sm text-gray-500 mt-1">{item.date}</p>}
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">€{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-lg">Total</span>
                <span className="text-3xl font-bold font-serif">€{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
