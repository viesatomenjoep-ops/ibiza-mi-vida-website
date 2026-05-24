'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type Variant = 'rustic-terracotta' | 'velvet-obsidian' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  showArrow?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  'rustic-terracotta': 'bg-rustic-terracotta text-white hover:bg-rustic-terracotta/90 active:bg-rustic-terracotta/90',
  'velvet-obsidian': 'bg-velvet-obsidian text-ibiza-sand hover:bg-velvet-obsidian/80',
  outline: 'border border-velvet-obsidian text-velvet-obsidian hover:bg-velvet-obsidian hover:text-ibiza-sand',
  ghost: 'text-rustic-terracotta hover:text-rustic-terracotta/90 underline-offset-4 hover:underline',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
}

export function Button({
  variant = 'rustic-terracotta',
  size = 'md',
  children,
  showArrow = false,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center rounded-full font-sans font-medium',
        'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-rustic-terracotta focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {showArrow && <ArrowRight className="shrink-0" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </button>
  )
}
