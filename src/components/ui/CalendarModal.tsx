'use client'

import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface CalendarModalProps {
  customTrigger?: (open: () => void, setMonth: (m: number) => void) => React.ReactNode
}

export function CalendarModal({ customTrigger }: CalendarModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(4) // Start at May (0-indexed)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
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

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {customTrigger ? customTrigger(() => setIsOpen(true), setCurrentMonth) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-velvet-obsidian text-white hover:bg-velvet-obsidian/90 transition-colors font-semibold rounded-xl text-sm"
        >
          <Calendar size={16} />
          View Full Calendar
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#030527]/40 backdrop-blur-[2px] transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Bottom Sheet Modal */}
          <div className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-b-[24px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300 h-[85vh] sm:h-auto sm:max-h-[90vh]">
            
            {/* Drag Handle (Mobile only) */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 bg-[#B8C2CC]/50 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-4 pt-2 flex items-center justify-between shrink-0">
              <div className="w-8" /> {/* spacer for centering */}
              <h2 className="text-[18px] font-sans text-[#030527] text-center flex-1">Select Date</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#030527] hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 pb-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Calendar Container */}
              <div className="bg-[#F7F8FA] rounded-[16px] p-4">
                
                {/* Month Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-[18px] text-[#030527] pl-2">
                    {activeMonth.name} {year}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={prevMonth}
                      disabled={currentMonth === 3}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#030527] disabled:opacity-50 shadow-sm border border-[#030527]/10"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={nextMonth}
                      disabled={currentMonth === 9}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#030527] disabled:opacity-50 shadow-sm border border-[#030527]/10"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center font-sans text-[14px] font-semibold text-[#030527]">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-2">
                  {/* Empty cells for start of month */}
                  {Array.from({ length: activeMonth.startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex justify-center items-center h-8">
                      {/* Previous month day mock */}
                      <span className="font-sans text-[14px] text-[#B8C2CC]">
                        {30 - activeMonth.startDay + i + 1}
                      </span>
                    </div>
                  ))}
                  
                  {/* Current month days */}
                  {Array.from({ length: activeMonth.days }).map((_, i) => {
                    const dayNum = i + 1
                    const isSelected = selectedDate === dayNum
                    // Mock events: day 7, 14, 21, 28
                    const hasEvent = dayNum % 7 === 0

                    return (
                      <div key={dayNum} className="flex justify-center items-center h-8 relative">
                        <button
                          onClick={() => setSelectedDate(dayNum)}
                          className={`
                            w-[30px] h-[30px] rounded-full flex items-center justify-center font-sans text-[14px] transition-all relative
                            ${isSelected 
                              ? 'bg-[#7086F8] text-white shadow-sm' 
                              : hasEvent 
                                ? 'border border-[#7086F8] text-[#030527] hover:bg-[#7086F8]/10' 
                                : 'text-[#030527] hover:bg-black/5'}
                          `}
                        >
                          {dayNum}
                        </button>
                      </div>
                    )
                  })}

                  {/* Empty cells for end of month */}
                  {Array.from({ length: 42 - (activeMonth.startDay + activeMonth.days) }).map((_, i) => (
                    <div key={`end-empty-${i}`} className="flex justify-center items-center h-8">
                      <span className="font-sans text-[14px] text-[#B8C2CC]">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Event Time Mock / Details */}
              <div className="mt-4 bg-[#F7F8FA] rounded-[16px] p-4 flex justify-between items-center">
                 <span className="font-sans text-[18px] text-[#030527]">Time</span>
                 <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border border-black/5">
                   <span className="font-sans text-[14px] text-[#030527]">12 PM</span>
                 </div>
              </div>

            </div>

            {/* Bottom Button Bar */}
            <div className="px-4 pb-8 pt-4 border-t border-[#EFF2F6] shrink-0 bg-white sm:rounded-b-[24px]">
              <button 
                onClick={() => {
                  if (selectedDate) {
                    setIsOpen(false)
                    // You can add routing logic here based on date
                  }
                }}
                disabled={!selectedDate}
                className="w-full py-4 rounded-full bg-[#030527] text-white font-sans text-[16px] font-medium transition-all disabled:opacity-50 disabled:bg-[#B8C2CC]"
              >
                {selectedDate ? `Show Events for ${activeMonth.name} ${selectedDate}` : 'Select a Date'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
