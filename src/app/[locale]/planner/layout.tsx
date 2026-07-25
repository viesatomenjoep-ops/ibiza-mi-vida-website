import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Private Ibiza Planner',
  robots: { index: false, follow: false },
}

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-obsidian">{children}</div>
}
