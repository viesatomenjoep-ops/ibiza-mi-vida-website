'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Trash2, Plus, RefreshCw, LogOut, UploadCloud, FileText } from 'lucide-react'
import Link from 'next/link'
import { parsePdfToListing } from '@/lib/pdfParser'

type CustomListing = {
  id: string
  type: string
  title: string
  description: string
  price: number
  image_url: string
  booking_link: string
  active: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [listings, setListings] = useState<CustomListing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [parsingPdf, setParsingPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'private_charter', // Default to private charter for PDF uploads
    title: '',
    description: '',
    price: '',
    image_url: '',
    booking_link: '',
  })

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('custom_listings')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setListings(data)
    }
    setLoading(false)
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingPdf(true)
    try {
      // 1. Extract text and render first page to image
      const parsedData = await parsePdfToListing(file)
      
      // Update basic fields immediately
      setFormData(prev => ({
        ...prev,
        title: parsedData.title,
        description: parsedData.description,
        price: parsedData.price,
        type: 'private_charter'
      }))

      // 2. Upload the extracted image to Cloudinary via our API route
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: parsedData.imageBase64 })
      })

      const uploadData = await uploadRes.json()
      
      if (uploadData.url) {
        setFormData(prev => ({ ...prev, image_url: uploadData.url }))
      } else if (uploadData.error) {
        alert('Image upload failed: ' + uploadData.error)
      }

    } catch (err: any) {
      alert('Error parsing PDF: ' + err.message)
    } finally {
      setParsingPdf(false)
      // Reset input so you can upload the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const { data, error } = await supabase
      .from('custom_listings')
      .insert([
        {
          type: formData.type,
          title: formData.title,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : null,
          image_url: formData.image_url,
          booking_link: formData.booking_link,
          active: true,
        }
      ])
      .select()

    if (error) {
      alert('Error saving listing: ' + error.message)
    } else {
      setFormData({
        type: 'private_charter',
        title: '',
        description: '',
        price: '',
        image_url: '',
        booking_link: '',
      })
      fetchListings()
    }
    setSaving(false)
  }

  async function deleteListing(id: string) {
    if (!confirm('Weet je zeker dat je deze listing wilt verwijderen?')) return
    
    const { error } = await supabase
      .from('custom_listings')
      .delete()
      .eq('id', id)
      
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      fetchListings()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight">Admin Dashboard</h1>
          <Link href="/" className="text-ibiza-green font-bold text-sm hover:underline flex items-center gap-2">
            <LogOut size={16} /> Terug naar website
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-ibiza-green" /> 
                Nieuwe toevoegen
              </h2>

              {/* PDF Uploader */}
              <div className="mb-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:bg-blue-100 transition-colors relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".pdf" 
                  onChange={handlePdfUpload} 
                  className="hidden" 
                />
                {parsingPdf ? (
                  <div className="flex flex-col items-center text-blue-600">
                    <RefreshCw className="animate-spin mb-2" size={24} />
                    <span className="text-sm font-bold">PDF analyseren en foto uploaden...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-blue-600">
                    <FileText className="mb-2" size={24} />
                    <span className="text-sm font-bold block mb-1">Automatisch inladen met PDF</span>
                    <span className="text-xs text-blue-500">Klik om een Private Charter PDF te selecteren</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-neutral-200 flex-1"></div>
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Of vul handmatig in</span>
                <div className="h-px bg-neutral-200 flex-1"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Type Event / Listing</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                    required
                  >
                    <option value="private_charter">Private Boat Charter</option>
                    <option value="boat_party">Bootfeest / Ferry</option>
                    <option value="club_ticket">Club Ticket</option>
                    <option value="activity">Activiteit / Excursie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Titel</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Bv: Sunset Boat Party San Antonio"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Beschrijving</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Korte pakkende beschrijving..."
                    rows={3}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Prijs (Optioneel)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="Bv: 49.99"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Afbeelding URL (Cloudinary)</label>
                  <input 
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Plak hier de direct link naar je plaatje.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Boekings Link (Check-out URL)</label>
                  <input 
                    type="url"
                    value={formData.booking_link}
                    onChange={e => setFormData({...formData, booking_link: e.target.value})}
                    placeholder="https://api.clubtickets.com/..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={saving}
                  className="mt-4 bg-black text-white font-bold py-3 rounded-lg hover:bg-ibiza-green hover:text-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Bezig met opslaan...' : 'Toevoegen aan database'}
                </button>

              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Jouw Listings</h2>
                <button onClick={fetchListings} className="text-neutral-400 hover:text-black">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {loading && listings.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">Laden...</div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 border-2 border-dashed border-neutral-100 rounded-xl">
                  Nog geen listings toegevoegd. Maak er links eentje aan!
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {listings.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-200 overflow-hidden shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">Geen IMG</div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-neutral-900">{item.title}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                              {item.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-1 flex gap-3">
                            {item.price && <span>€{item.price}</span>}
                            {item.booking_link ? (
                              <a href={item.booking_link} target="_blank" rel="noreferrer" className="text-ibiza-green hover:underline">Test Link</a>
                            ) : (
                              <span>Geen link</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteListing(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Verwijderen"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
