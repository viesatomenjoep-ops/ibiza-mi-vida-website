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

        // Design 2.0 Ultra-Modern Dark Theme Palette
        'ibiza-orange': '#FF4E00',
        'ibiza-dark': '#0A0A0A',
        'ibiza-card': '#141414',
        // Business accent — kept in lockstep with the `gold` token below so the
        // site has exactly one accent. See the note there for the colour history
        // and the contrast rules.
        'ibiza-green': '#0E7C66',
        // Palest tint of the accent, for soft section backgrounds on white.
        'ibiza-mint': '#E4F2ED',

        // VIP Concierge / Ibiza Planner luxury palette
        obsidian: {
          DEFAULT: '#0B0C10',
          light: '#111319',
          card: '#14161D',
        },
        // Accent — deep emerald (was slate blue, before that purple, before that
        // actual gold). Token name kept as `gold` so every existing *-gold*
        // utility recolours globally. This is the MARKETING SITE's brand accent
        // — do not repoint it for app-only work below.
        //
        // Contrast, measured against WCAG AA (4.5:1 for normal text):
        //   white on DEFAULT ....... 5.16:1  ✓  — use for solid fills
        //   black on DEFAULT ....... 4.07:1  ✗  — do NOT put dark text on a fill
        //   DEFAULT on obsidian .... 3.68:1  ✗  — too dim for accent text on dark
        //   soft    on obsidian .... 8.30:1  ✓  — use for accent TEXT on dark
        // So: `gold` fills surfaces, `gold-soft` writes on dark ones.
        gold: {
          DEFAULT: '#0E7C66',
          soft: '#3FBF9A',
          faint: 'rgba(14, 124, 102, 0.14)',
        },
        // /m app shell accent — warm copper/bronze against the app's obsidian
        // surfaces, replacing an earlier blue that read too close to the
        // marketing site's own accent and too "generic SaaS/AI-app" against a
        // dark UI. Scoped to the app (BottomNav, sheets, Map3D, the mobile
        // homepage strip) — the rest of the site keeps `gold` untouched.
        'app-accent': {
          DEFAULT: '#B9754A',
          soft: '#D49A6A',
          faint: 'rgba(185, 117, 74, 0.14)',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-display)', ...defaultTheme.fontFamily.serif],
        display: ['Outfit', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
        montserrat: ['var(--font-montserrat)', 'Montserrat', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'marquee-vertical': 'marquee-vertical 25s linear infinite',
      }
    },
  },
  plugins: [],
}

export default config
