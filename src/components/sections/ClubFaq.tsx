'use client'

import React, { useState } from 'react'

const FAQS = [
  {
    question: "How do I receive my tickets?",
    answer: "Tickets are sent to your email address as a PDF or mobile QR code immediately after payment. Keep them safe on your phone."
  },
  {
    question: "Are the tickets 100% authentic?",
    answer: "Absolutely. We are official partners of all major clubs in Ibiza, so you never run any risk at the door."
  },
  {
    question: "What time do I need to be inside?",
    answer: "Pay attention to the time slot on your ticket. Early-entry tickets often require you to be inside before a specific time (e.g., 01:00)."
  },
  {
    question: "Can I also book VIP tables?",
    answer: "Yes, we offer VIP tables with bottles and personalized service for almost every club. Contact us via WhatsApp for prices."
  }
];

export function ClubFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="px-[5%] py-20 bg-white">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-blue-500 font-semibold tracking-widest uppercase mb-2">Tickets FAQ</p>
          <h2 className="text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Find quick answers to frequently asked questions about booking club tickets.</p>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button 
                className="w-full text-left px-6 py-5 font-semibold text-lg flex justify-between items-center bg-gray-50 text-black hover:bg-gray-100 transition-colors"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                {faq.question}
                <svg className={`w-6 h-6 transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === idx && (
                <div className="px-6 py-5 bg-white text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
