'use client'

import { useState } from 'react'
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react'

export function CalendarModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(4) // Start at April (0-indexed, so 3 is April, 4 is May)
  const year = 2026

  const months = [
    { name: 'April', index: 3, days: 30, startDay: 3 }, // April 1st 2026 is Wed (3)
    { name: 'May', index: 4, days: 31, startDay: 5 },   // May 1st is Fri (5)
    { name: 'June', index: 5, days: 30, startDay: 1 },  // June 1st is Mon (1)
    { name: 'July', index: 6, days: 31, startDay: 3 },  // July 1st is Wed (3)
    { name: 'August', index: 7, days: 31, startDay: 6 }, // Aug 1st is Sat (6)
    { name: 'September', index: 8, days: 30, startDay: 2 }, // Sept 1st is Tue (2)
    { name: 'October', index: 9, days: 31, startDay: 4 }, // Oct 1st is Thu (4)
  ]

  const activeMonth = months.find(m => m.index === currentMonth) || months[1]

  const nextMonth = () => {
    if (currentMonth < 9) setCurrentMonth(prev => prev + 1)
  }
  const prevMonth = () => {
    if (currentMonth > 3) setCurrentMonth(prev => prev - 1)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold rounded-xl text-sm border border-white/20"
      >
        <Calendar size={16} />
        View Full Calendar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-3xl bg-[#111111] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#161616]">
              <div>
                <h2 className="text-2xl font-serif text-gold">Ibiza Season {year}</h2>
                <p className="text-sandstone/60 text-sm">Select a date to view all events and deals</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Calendar Controls */}
            <div className="p-6 bg-gradient-to-b from-[#161616] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={prevMonth}
                  disabled={currentMonth === 3}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors text-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                  <h3 className="text-3xl font-serif text-white">{activeMonth.name}</h3>
                  <p className="text-gold tracking-widest uppercase text-xs font-bold mt-1">High Season</p>
                </div>
                <button 
                  onClick={nextMonth}
                  disabled={currentMonth === 9}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors text-white"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sandstone/40 text-xs uppercase tracking-wider font-semibold">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {Array.from({ length: activeMonth.startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-xl bg-white/5 opacity-20" />
                ))}
                
                {Array.from({ length: activeMonth.days }).map((_, i) => {
                  const dayNum = i + 1
                  const isToday = currentMonth === new Date().getMonth() && dayNum === new Date().getDate()
                  // Mock some random events
                  const hasEvents = dayNum % 3 === 0 || dayNum % 5 === 0
                  
                  return (
                    <button 
                      key={dayNum}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-xl border transition-all
                        ${isToday ? 'border-gold bg-gold/10' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                      `}
                    >
                      <span className={`text-lg font-semibold ${isToday ? 'text-gold' : 'text-white'}`}>{dayNum}</span>
                      {hasEvents && (
                        <div className="flex gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-teal"></span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Date Details (Mock) */}
            <div className="p-6 bg-white/5 border-t border-white/10 mt-auto">
              <div className="flex justify-between items-center">
                <p className="text-sandstone/60 text-sm">Click any date to instantly load the deals for that day.</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-white">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold"></span> Club Event</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal"></span> Boat Party</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
