'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Trash2, Plus, RefreshCw, LogOut, UploadCloud, FileText, CheckCircle, Save, X } from 'lucide-react'
import Link from 'next/link'
import { parsePdfToListing, ParsedPDFData } from '@/lib/pdfParser'

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
  
  // Array of parsed drafts from PDF
  const [draftListings, setDraftListings] = useState<ParsedPDFData[]>([])

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
      const parsedArray = await parsePdfToListing(file)
      
      // Add the new parsed items to the drafts list
      setDraftListings(prev => [...prev, ...parsedArray])

    } catch (err: any) {
      alert('Error parsing PDF: ' + err.message)
    } finally {
      setParsingPdf(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const updateDraft = (id: string, field: keyof ParsedPDFData, value: string) => {
    setDraftListings(prev => prev.map(draft => 
      draft.id === id ? { ...draft, [field]: value } : draft
    ))
  }

  const removeDraft = (id: string) => {
    setDraftListings(prev => prev.filter(draft => draft.id !== id))
  }

  async function handleSaveDrafts() {
    if (draftListings.length === 0) return;
    
    setSaving(true)
    setSuccessMsg('')
    
    try {
      let savedCount = 0;
      
      // Process drafts one by one (could be parallelized but sequential is safer for rate limits)
      for (const draft of draftListings) {
        
        let finalImageUrl = '';
        
        // 1. Upload Base64 image to Cloudinary
        if (draft.imageBase64 && draft.imageBase64.startsWith('data:image')) {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: draft.imageBase64 })
          })

          const uploadData = await uploadRes.json()
          if (uploadData.url) {
            finalImageUrl = uploadData.url;
          }
        }
        
        // 2. Insert to Supabase
        const { error } = await supabase
          .from('custom_listings')
          .insert([
            {
              category_slug: draft.category_slug || 'boat-charters',
              slug: generateSlug(draft.title),
              title: draft.title,
              description: draft.description,
              price_from: draft.price ? parseFloat(draft.price) : null,
              image_url: finalImageUrl,
              is_active: true,
            }
          ])
          
        if (!error) {
          savedCount++;
        } else {
          console.error("Error saving draft:", draft.title, error.message);
        }
      }
      
      setSuccessMsg(`${savedCount} advertenties succesvol opgeslagen!`)
      setDraftListings([]) // clear drafts
      fetchListings() // refresh live list
      
    } catch (err: any) {
      alert('Error saving listings: ' + err.message)
    } finally {
      setSaving(false)
    }
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
          
          {/* Main Upload / Drafts Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-ibiza-green" /> 
                PDF Catalogus Inladen
              </h2>
              <p className="text-sm text-neutral-500 mb-6">Upload een PDF met boten of advertenties. Elke pagina wordt automatisch verwerkt tot een aparte, bewerkbare advertentie.</p>

              {/* PDF Uploader */}
              <div className="mb-2 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center hover:bg-blue-100 transition-colors relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".pdf" 
                  onChange={handlePdfUpload} 
                  className="hidden" 
                />
                {parsingPdf ? (
                  <div className="flex flex-col items-center text-blue-600">
                    <RefreshCw className="animate-spin mb-3" size={32} />
                    <span className="text-lg font-bold">PDF analyseren...</span>
                    <span className="text-sm">Dit kan even duren afhankelijk van het aantal pagina's.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-blue-600">
                    <FileText className="mb-3" size={32} />
                    <span className="text-lg font-bold block mb-1">Selecteer een PDF Bestand</span>
                    <span className="text-sm text-blue-500">Bv: Catalogus_2026.pdf (1 pagina = 1 advertentie)</span>
                  </div>
                )}
              </div>
            </div>

            {/* DRAFTS SECTION */}
            {draftListings.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-ibiza-green/30">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      Concepten ({draftListings.length})
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">Controleer en bewerk de ingeladen items voordat je ze opslaat.</p>
                  </div>
                  <button 
                    onClick={handleSaveDrafts}
                    disabled={saving}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-ibiza-green hover:text-black transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    Opslaan ({draftListings.length})
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {draftListings.map((draft, idx) => (
                    <div key={draft.id} className="flex flex-col md:flex-row gap-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 relative group">
                      <button 
                        onClick={() => removeDraft(draft.id)}
                        className="absolute -top-3 -right-3 bg-white border border-neutral-200 text-neutral-500 hover:text-red-500 hover:border-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors z-10"
                        title="Verwijder"
                      >
                        <X size={14} />
                      </button>

                      {/* Preview Image */}
                      <div className="w-full md:w-48 shrink-0 relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-200 border border-black/10">
                        {draft.imageBase64 ? (
                          <img src={draft.imageBase64} alt={draft.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">Geen foto</div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-black px-2 py-1 rounded-md">
                          Pagina {idx + 1}
                        </div>
                      </div>

                      {/* Edit Form */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Titel</label>
                          <input 
                            type="text"
                            value={draft.title}
                            onChange={e => updateDraft(draft.id, 'title', e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none font-bold"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Categorie</label>
                          <select 
                            value={draft.category_slug}
                            onChange={e => updateDraft(draft.id, 'category_slug', e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                          >
                            <option value="private-charter">Private Boat Charter</option>
                            <option value="boat-party">Bootfeest / Ferry</option>
                            <option value="activity">Activiteit / Excursie</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Vanaf Prijs (€)</label>
                          <input 
                            type="text"
                            value={draft.price}
                            onChange={e => updateDraft(draft.id, 'price', e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Beschrijving</label>
                          <textarea 
                            value={draft.description}
                            onChange={e => updateDraft(draft.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-ibiza-green outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3 border border-green-200 font-bold">
                <CheckCircle size={24} /> {successMsg}
              </div>
            )}
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
                      
                      <div className="flex items-center gap-3 w-full pr-2 overflow-hidden">
                        <div className="w-14 h-14 rounded-xl bg-neutral-200 overflow-hidden shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">IMG</div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-neutral-900 text-sm truncate">{item.title}</h3>
                          <div className="text-[10px] text-neutral-500 flex gap-2 items-center mt-1">
                            <span className="uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full truncate max-w-[100px]">
                              {item.category_slug}
                            </span>
                            {item.price_from && <span className="font-bold shrink-0">€{item.price_from}</span>}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteListing(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
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
