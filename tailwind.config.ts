import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#102033', // Keeping for legacy, use velvet-obsidian
        sandstone: '#E9DFD2',
        teal: {
          DEFAULT: '#169C90',
          dark: '#0e7069',
          light: '#1dbdaf',
        },
        'soft-white': '#FAF8F4',
        driftwood: '#B89F84',
        'sys-bg': '#EFF2F6',
        
        // Ibiza Velvet & Modern Luxury Palette -> mapped to new ibiza-design tokens
        'velvet-obsidian': 'var(--color-ink)',
        'ibiza-sand': 'var(--color-paper)',
        'rustic-terracotta': 'var(--color-sea)',
        'champagne-bronze': 'var(--color-mist)',
      },
      fontFamily: {
        sans: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-display)', ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
