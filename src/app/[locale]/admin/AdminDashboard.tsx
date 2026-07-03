'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Trash2, Plus, RefreshCw, LogOut, UploadCloud, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { parsePdfToListing } from '@/lib/pdfParser'

type CustomListing = {
  id: string
  category_slug: string
  slug: string
  title: string
  description: string
  price_from: number
  image_url: string
  is_active: boolean
  created_at: string
}

const generateSlug = (title: string) => {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

export default function AdminDashboard() {
  const [listings, setListings] = useState<CustomListing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [parsingPdf, setParsingPdf] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [successMsg, setSuccessMsg] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    category_slug: 'private-charter',
    title: '',
    description: '',
    price_from: '',
    image_url: '',
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
    setSuccessMsg('')
    try {
      const parsedData = await parsePdfToListing(file)
      
      setFormData(prev => ({
        ...prev,
        title: parsedData.title,
        description: parsedData.description,
        price_from: parsedData.price,
        category_slug: 'private-charter'
      }))

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
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    
    const { data, error } = await supabase
      .from('custom_listings')
      .insert([
        {
          category_slug: formData.category_slug,
          slug: generateSlug(formData.title),
          title: formData.title,
          description: formData.description,
          price_from: formData.price_from ? parseFloat(formData.price_from) : null,
          image_url: formData.image_url,
          is_active: true,
        }
      ])
      .select()

    if (error) {
      alert('Error saving listing: ' + error.message)
    } else {
      setSuccessMsg('Advertentie succesvol opgeslagen en live gezet!')
      setFormData({
        category_slug: 'private-charter',
        title: '',
        description: '',
        price_from: '',
        image_url: '',
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
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight">Admin Dashboard</h1>
          <Link href="/" className="text-ibiza-green font-bold text-sm hover:underline flex items-center gap-2">
            <LogOut size={16} /> Terug naar website
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-ibiza-green" /> 
                Nieuwe toevoegen
              </h2>

              {/* PDF Uploader */}
              <div className="mb-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center hover:bg-blue-100 transition-colors relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
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
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Of vul handmatig in</span>
                <div className="h-px bg-neutral-200 flex-1"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Categorie</label>
                  <select 
                    value={formData.category_slug}
                    onChange={e => setFormData({...formData, category_slug: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                    required
                  >
                    <option value="private-charter">Private Boat Charter</option>
                    <option value="boat-party">Bootfeest / Ferry</option>
                    <option value="activity">Activiteit / Excursie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Titel</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Bv: Sunset Boat Party San Antonio"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Beschrijving</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Korte pakkende beschrijving..."
                    rows={4}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Prijs vanaf (€)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.price_from}
                    onChange={e => setFormData({...formData, price_from: e.target.value})}
                    placeholder="Bv: 49.99"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Afbeelding URL (Cloudinary)</label>
                  <input 
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                  />
                </div>

                {successMsg && (
                  <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl flex items-center gap-2 border border-green-200">
                    <CheckCircle size={16} /> {successMsg}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={saving || !formData.title}
                  className="mt-2 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-ibiza-green hover:text-black transition-colors disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {saving ? 'Bezig met opslaan...' : 'Advertentie Opslaan'}
                </button>

              </form>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 sticky top-32">
              <h2 className="text-xl font-bold mb-4">Live Preview</h2>
              <div className="text-sm text-neutral-500 mb-6">Zo komt de advertentie eruit te zien op de Private Boat Charters pagina:</div>
              
              {formData.title || formData.image_url ? (
                <div className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-lg group">
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                        <FileText size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {formData.category_slug.replace('-', ' ')}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-xl mb-2 line-clamp-2 leading-tight">{formData.title || 'Titel van de listing'}</h3>
                    <p className="text-neutral-500 text-sm line-clamp-3 mb-4 leading-relaxed">{formData.description || 'De beschrijving komt hier...'}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xs uppercase tracking-widest font-bold text-neutral-400">Vanaf</div>
                      <div className="text-lg font-black">€{formData.price_from || '0'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center text-neutral-400 p-8 text-center bg-neutral-50">
                  Upload een PDF of vul de velden links in om de preview te zien.
                </div>
              )}
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Live Listings</h2>
                <button onClick={fetchListings} className="text-neutral-400 hover:text-black">
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {loading && listings.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">Laden...</div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 border-2 border-dashed border-neutral-100 rounded-2xl">
                  Nog geen listings toegevoegd.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {listings.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                      
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-neutral-200 overflow-hidden shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">IMG</div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-neutral-900 text-sm line-clamp-1">{item.title}</h3>
                          </div>
                          <div className="text-[10px] text-neutral-500 flex gap-2 items-center">
                            <span className="uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full">
                              {item.category_slug}
                            </span>
                            {item.price_from && <span className="font-bold">€{item.price_from}</span>}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteListing(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 ml-2"
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
