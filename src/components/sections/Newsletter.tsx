'use client'

import React from 'react'

export function Newsletter() {
  return (
    <section className="px-[5%] py-20 bg-black text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-blue-400 font-semibold tracking-widest uppercase mb-4">Stay Updated</p>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Don't Miss Any Party</h2>
        <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
          Subscribe to our newsletter and be the first to receive updates on ticket sales, exclusive line-up reveals, and the best VIP deals for your Ibiza trip.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-6 py-4 rounded-full text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500 transition-colors shrink-0">
            Subscribe
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          By subscribing you agree to our Privacy Policy.
        </p>
      </div>
    </section>
  )
}
