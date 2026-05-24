'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

type Message = {
  id: string
  text: string
  sender: 'bot' | 'user'
}

export function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I am the Ibiza mi vida AI assistant. Ask me anything about our club tickets, private boat charters, VIP tables, or upcoming events!',
      sender: 'bot'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user'
    }

    setMessages(prev => [...prev, newUserMsg])
    setInputValue('')
    setIsTyping(true)

    // Simulate n8n webhook / AI delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! This chatbot will soon be connected to n8n to provide instant answers to all your questions about Ibiza mi vida. Stay tuned!',
        sender: 'bot'
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50 lg:bottom-8 lg:right-8">
        
        {/* Floating Chat Button (Bouncing) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 transition-colors hover:bg-[#20bd5a] focus-visible:outline-none"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-label="Open AI Assistant"
            >
              <MessageCircle size={28} strokeWidth={2} />
              
              {/* Notification dot */}
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 right-0 w-[350px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col border border-black/10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-velvet-obsidian p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                    <Bot size={20} className="text-champagne-bronze" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-velvet-obsidian"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-[16px] font-medium leading-tight">Ibiza mi vida AI</span>
                    <span className="font-sans text-[11px] text-white/60">Online • Powered by n8n</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-ibiza-sand/30">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-rustic-terracotta' : 'bg-velvet-obsidian'}`}>
                      {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-champagne-bronze" />}
                    </div>
                    <div className={`p-3 rounded-2xl font-sans text-[14px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-rustic-terracotta text-white rounded-tr-sm' : 'bg-white border border-black/5 text-velvet-obsidian rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 max-w-[85%] self-start">
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-velvet-obsidian">
                      <Bot size={14} className="text-champagne-bronze" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-black/5 rounded-tl-sm flex items-center gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-velvet-obsidian/40 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-velvet-obsidian/40 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-velvet-obsidian/40 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-black/5 shrink-0">
                <div className="flex items-center gap-2 bg-ibiza-sand/50 rounded-full border border-black/5 p-1 pl-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about events, tickets..."
                    className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] text-velvet-obsidian"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
