'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type Variant = 'teal' | 'midnight' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  showArrow?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  teal: 'bg-teal text-white hover:bg-teal-dark active:bg-teal-dark',
  midnight: 'bg-midnight text-soft-white hover:bg-midnight/80',
  outline: 'border border-midnight text-midnight hover:bg-midnight hover:text-soft-white',
  ghost: 'text-teal hover:text-teal-dark underline-offset-4 hover:underline',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
}

export function Button({
  variant = 'teal',
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
        'focus-visible:ring-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
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
