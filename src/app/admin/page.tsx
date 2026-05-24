import { AdminDashboard } from './AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Ibiza mi vida',
  description: 'Manage platform content',
  robots: {
    index: false,
    follow: false
  }
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <h1 className="mb-8 font-serif text-3xl text-midnight">Platform Management</h1>
        <AdminDashboard />
      </div>
    </div>
  )
}
