import type { ReactNode } from 'react'

interface CategoryGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
}

const colClasses = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export function CategoryGrid({ children, columns = 3 }: CategoryGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-5 md:gap-6 ${colClasses[columns]}`}>
      {children}
    </div>
  )
}
