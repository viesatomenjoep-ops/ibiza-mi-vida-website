'use client'

import React from 'react'
import { Search, SlidersHorizontal, MapPin, XCircle, Clock } from 'lucide-react'

export function HomeSearchFigma() {
  return (
    <div className="w-full max-w-md mx-auto bg-white pt-6 pb-8 px-4 flex flex-col gap-6">
      
      {/* Search Header */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-sans text-[18px] text-[#030527] text-center">Find Perfect Event</h2>
        
        {/* Input 1 */}
        <div className="w-full h-12 bg-[#F7F8FA] border border-[#EFF2F6] rounded-full flex items-center px-4 gap-3">
          <Search size={20} className="text-[#030527]" />
          <input 
            type="text" 
            placeholder="Search events, clubs..." 
            className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-[#030527] placeholder:text-[#818898]"
          />
          <SlidersHorizontal size={20} className="text-[#030527]" />
        </div>

        {/* Input 2 */}
        <div className="w-full h-12 bg-[#F7F8FA] border border-[#EFF2F6] rounded-full flex items-center px-4 gap-3">
          <MapPin size={20} className="text-[#030527]" />
          <input 
            type="text" 
            placeholder="Ibiza, Spain" 
            className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-[#030527] placeholder:text-[#818898]"
          />
        </div>
      </div>

      {/* Popular Event List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-[18px] text-[#030527] mb-1">Popular Event</h3>

        {/* Card 1: Green */}
        <div className="w-full bg-[#89F4C7] rounded-[20px] p-4 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-[#030527] rounded-full flex flex-col items-center justify-center -mt-1 shadow-md">
              <span className="font-sans text-[18px] font-medium text-white leading-tight">25</span>
              <span className="font-sans text-[10px] font-light text-[#EFF2F6]">Sept</span>
            </div>
            <h4 className="font-sans text-[16px] font-light text-[#030527] leading-[140%] max-w-[150px]">
              Golden Gate Arts and Culture
            </h4>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col flex-1 gap-2">
              <span className="font-sans text-[12px] font-light text-[#030527]">Visionary Arts Group</span>
              <h3 className="font-sans text-[24px] font-medium text-[#030527] leading-[110%] max-w-[180px]">
                Spring Art Extravaganza
              </h3>
            </div>
            
            <div className="flex items-center bg-[#030527]/40 rounded-full py-1 pr-3 pl-1 backdrop-blur-sm gap-1">
               <div className="flex -space-x-3">
                 <div className="w-8 h-8 rounded-full border border-white bg-gray-300 overflow-hidden z-[1]"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                 <div className="w-8 h-8 rounded-full border border-white bg-gray-400 overflow-hidden z-[2]"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                 <div className="w-8 h-8 rounded-full border border-white bg-white z-[3]" />
               </div>
               <span className="font-sans text-[12px] text-[#030527] font-medium ml-1">5+</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blue */}
        <div className="w-full bg-[#7086F8] rounded-[20px] p-4 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-[#030527] rounded-full flex flex-col items-center justify-center -mt-1 shadow-md">
              <span className="font-sans text-[18px] font-medium text-white leading-tight">24</span>
              <span className="font-sans text-[10px] font-light text-[#EFF2F6]">Sept</span>
            </div>
            <h4 className="font-sans text-[16px] font-light text-white leading-[140%] max-w-[150px]">
              San Francisco Golden Gate Pavilion
            </h4>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col flex-1 gap-2">
              <span className="font-sans text-[12px] font-light text-white">Sonic Waves Productions</span>
              <h3 className="font-sans text-[24px] font-medium text-white leading-[110%] max-w-[180px]">
                Summer Music Festival
              </h3>
            </div>
            
            <div className="flex items-center bg-[#030527]/40 rounded-full py-1 pr-3 pl-1 backdrop-blur-sm gap-1">
               <div className="flex -space-x-3">
                 <div className="w-8 h-8 rounded-full border border-white bg-gray-300 overflow-hidden z-[1]"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                 <div className="w-8 h-8 rounded-full border border-white bg-gray-400 overflow-hidden z-[2]"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                 <div className="w-8 h-8 rounded-full border border-white bg-white z-[3]" />
               </div>
               <span className="font-sans text-[12px] text-[#030527] font-medium ml-1">9+</span>
            </div>
          </div>
        </div>

        {/* Card 3: Yellow */}
        <div className="w-full bg-[#F6FE80] rounded-[20px] p-4 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-[#030527] rounded-full flex flex-col items-center justify-center -mt-1 shadow-md">
              <span className="font-sans text-[18px] font-medium text-white leading-tight">27</span>
              <span className="font-sans text-[10px] font-light text-[#EFF2F6]">Sept</span>
            </div>
            <h4 className="font-sans text-[16px] font-light text-[#030527] leading-[140%] max-w-[150px]">
              Golden Gate Run for Charity
            </h4>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col flex-1 gap-2">
              <span className="font-sans text-[12px] font-light text-[#030527]">Miles for Smiles</span>
              <h3 className="font-sans text-[24px] font-medium text-[#030527] leading-[110%] max-w-[180px]">
                Spring Giving Celebration
              </h3>
            </div>
            
            <div className="flex items-center bg-[#030527]/40 rounded-full py-1 pr-3 pl-1 backdrop-blur-sm gap-1">
               <div className="flex -space-x-3">
                 <div className="w-8 h-8 rounded-full border border-white bg-gray-300 overflow-hidden z-[1]"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                 <div className="w-8 h-8 rounded-full border border-white bg-gray-400 overflow-hidden z-[2]"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" alt="user" className="w-full h-full object-cover" /></div>
                 <div className="w-8 h-8 rounded-full border border-white bg-white z-[3]" />
               </div>
               <span className="font-sans text-[12px] text-[#030527] font-medium ml-1">20+</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
