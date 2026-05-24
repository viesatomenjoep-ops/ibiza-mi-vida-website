'use client'

import { useEffect, useState } from 'react'

interface DealsPreviewWrapperProps {
  children: React.ReactNode
  isAdminPreview: boolean
}

export function DealsPreviewWrapper({ children, isAdminPreview }: DealsPreviewWrapperProps) {
  const [previewData, setPreviewData] = useState<any>(null)

  useEffect(() => {
    if (!isAdminPreview) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ADMIN_PREVIEW_UPDATE') {
        setPreviewData(event.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isAdminPreview])

  if (!isAdminPreview) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Live Preview Indicator overlay */}
      <div className="fixed bottom-4 left-4 z-50 rounded-full bg-midnight/90 px-4 py-2 font-sans text-sm font-semibold text-gold shadow-lg backdrop-blur-md">
        CMS Preview Active (Code-Synced)
      </div>

      {previewData && (
        <div className="bg-gold/10 border-b-2 border-gold p-4 text-center font-sans">
          <p className="font-semibold text-midnight">Live Draft Update Recieved:</p>
          <div className="text-sm mt-1">
            <strong>Category:</strong> {previewData.category} | 
            <strong> Title (EN):</strong> {previewData.title_en} | 
            <strong> Price:</strong> €{previewData.price}
          </div>
        </div>
      )}

      <div style={{ opacity: previewData ? 0.9 : 1, transition: 'opacity 0.2s' }}>
        {children}
      </div>
    </div>
  )
}
