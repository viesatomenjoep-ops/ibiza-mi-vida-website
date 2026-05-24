'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Plus, Save, Image as ImageIcon, Trash2, Edit2, X, Loader2 } from 'lucide-react'

type Experience = {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  price_from: number
  available: boolean
}

export function AdminDashboard() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('boat-party')
  
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null)
  const [uploading, setUploading] = useState(false)

  const supabase = getSupabaseClient()

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setExperiences(data)
    if (error) console.error(error)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editingItem?.title || !editingItem?.category) return alert('Title and category required')
    
    setLoading(true)
    let error;

    if (editingItem.id) {
      // Update
      const experiencesTable = supabase.from('experiences') as any
      const { error: updateError } = await experiencesTable
        .update({
          title: editingItem.title,
          description: editingItem.description || '',
          price_from: editingItem.price_from || 0,
          image_url: editingItem.image_url || '',
          available: editingItem.available ?? true,
        })
        .eq('id', editingItem.id)
      error = updateError
    } else {
      // Insert
      const experiencesTable = supabase.from('experiences') as any
      const { error: insertError } = await experiencesTable
        .insert({
          slug: editingItem.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now(),
          title: editingItem.title,
          category: editingItem.category,
          description: editingItem.description || '',
          price_from: editingItem.price_from || 0,
          image_url: editingItem.image_url || '',
          available: editingItem.available ?? true,
        })
      error = insertError
    }

    if (error) {
      console.error(error)
      alert('Error saving: ' + error.message)
    } else {
      setEditingItem(null)
      fetchExperiences()
    }
    setLoading(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `experiences/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('website_media')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('website_media').getPublicUrl(filePath)
    
    setEditingItem(prev => prev ? { ...prev, image_url: data.publicUrl } : null)
    setUploading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    const experiencesTable = supabase.from('experiences') as any
    const { error } = await experiencesTable.delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchExperiences()
  }

  const filteredExperiences = experiences.filter(e => e.category === activeCategory)

  const categories = [
    { id: 'boat-party', label: 'Boat Parties' },
    { id: 'boat-charter', label: 'Private Charters' },
    { id: 'club-ticket', label: 'Club Tickets' },
    { id: 'car-rental', label: 'Car Rentals' },
  ]

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {/* Sidebar / Category Selection */}
      <div className="w-full md:w-64 shrink-0">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-black/5">
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-midnight/50">
            Categories
          </h2>
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-midnight text-white' : 'text-midnight hover:bg-black/5'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-black/5">
        
        {editingItem ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-midnight">
                {editingItem.id ? 'Edit Advertisement' : 'Add New Advertisement'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="rounded-full p-2 hover:bg-black/5 text-midnight">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wider text-midnight/50">Title</label>
                  <input 
                    type="text" 
                    value={editingItem.title || ''}
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full rounded-lg border border-black/10 px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wider text-midnight/50">Price (From)</label>
                  <input 
                    type="number" 
                    value={editingItem.price_from || 0}
                    onChange={e => setEditingItem({...editingItem, price_from: Number(e.target.value)})}
                    className="w-full rounded-lg border border-black/10 px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wider text-midnight/50">Description</label>
                  <textarea 
                    rows={4}
                    value={editingItem.description || ''}
                    onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full rounded-lg border border-black/10 px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="flex flex-col gap-2">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-midnight/50">Photo</label>
                <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-black/10 bg-gray-50 transition-colors hover:border-teal">
                  {editingItem.image_url ? (
                    <img src={editingItem.image_url} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-midnight/40">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="font-sans text-sm font-medium">Upload Image</span>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                      <Loader2 className="animate-spin text-teal" size={24} />
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={uploading}
                  />
                </div>
                {editingItem.image_url && (
                  <button 
                    onClick={() => setEditingItem({...editingItem, image_url: ''})}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3 border-t border-black/5 pt-6">
              <button 
                onClick={() => setEditingItem(null)}
                className="rounded-full px-6 py-2.5 font-sans text-sm font-semibold text-midnight hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading || uploading}
                className="flex items-center gap-2 rounded-full bg-teal px-8 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-teal-dark disabled:opacity-50 shadow-lg"
              >
                <Save size={16} />
                Save Advertisement
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-midnight">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <button 
                onClick={() => setEditingItem({ category: activeCategory, available: true })}
                className="flex items-center gap-2 rounded-full bg-midnight px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-midnight/90 shadow-md"
              >
                <Plus size={16} />
                Add New
              </button>
            </div>

            {loading ? (
              <div className="flex py-12 justify-center">
                <Loader2 className="animate-spin text-midnight/30" size={32} />
              </div>
            ) : filteredExperiences.length === 0 ? (
              <div className="py-16 text-center text-midnight/40">
                <p className="font-sans text-lg">No advertisements found in this category.</p>
                <p className="font-sans text-sm mt-1">Click "Add New" to create one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExperiences.map(exp => (
                  <div key={exp.id} className="group relative flex overflow-hidden rounded-xl border border-black/5 bg-white p-3 shadow-sm hover:shadow-md transition-all">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {exp.image_url ? (
                        <img src={exp.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-midnight/20">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-center">
                      <h3 className="font-serif text-lg leading-tight text-midnight">{exp.title}</h3>
                      <p className="font-sans text-sm text-midnight/50 line-clamp-1 mt-0.5">{exp.description}</p>
                      <p className="font-sans text-sm font-semibold text-teal mt-1">€{exp.price_from}</p>
                    </div>
                    
                    <div className="absolute right-3 top-3 flex opacity-0 transition-opacity group-hover:opacity-100 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-black/5">
                      <button 
                        onClick={() => setEditingItem(exp)}
                        className="p-2 text-midnight hover:text-teal transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors border-l border-black/5"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
