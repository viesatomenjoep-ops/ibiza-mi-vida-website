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
        // ── Palet ────────────────────────────────────────────────────────
        // De waarden zelf staan in globals.css onder :root; hier alleen de
        // verwijzing, zodat er één bron van waarheid is. Gebruik deze als
        // `bg-imv-rose`, `text-imv-ink`, enzovoort.
        //
        // Geen van de vier bladkleuren draagt witte tekst (1,19 tot 2,79).
        // Moet er wit op, pak dan de `-deep` variant; die zijn daarop
        // gemaakt. Voor donkere tekst kan de bladkleur zelf.
        imv: {
          blush: 'var(--imv-blush)',
          rose: 'var(--imv-rose)',
          grey: 'var(--imv-grey)',
          blue: 'var(--imv-blue)',
          olive: 'var(--imv-olive)',
          ink: 'var(--imv-ink)',
          'rose-deep': 'var(--imv-rose-deep)',
          'grey-deep': 'var(--imv-grey-deep)',
          'blue-deep': 'var(--imv-blue-deep)',
          'olive-deep': 'var(--imv-olive-deep)',
        },

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
        //
        // De naam klopt niet meer sinds het accent zwart is; hij staat er nog
        // omdat elk *-ibiza-green* hulpmiddel er nog naar wijst. Repoint hier,
        // niet in de componenten.
        'ibiza-green': '#000000',
        // Palest tint of the accent, voor zachte sectievlakken op wit. Was een
        // muntgroen (#E4F2ED); zwart heeft geen bleke tint, dus dit is nu de
        // blush uit het palet.
        'ibiza-mint': 'var(--imv-blush)',

        // VIP Concierge / Ibiza Planner luxury palette
        obsidian: {
          DEFAULT: '#0B0C10',
          light: '#111319',
          card: '#14161D',
        },
        // Accent — zwart (was deep emerald, daarvoor slate blue, purple, en ooit
        // echt goud). Tokennaam blijft `gold` zodat elk bestaand *-gold*
        // hulpmiddel in één keer meeverkleurt. Dit is het accent van de
        // MARKETINGSITE — niet repointen voor app-werk hieronder.
        //
        // Contrast, gemeten tegen WCAG AA (4,5:1 voor gewone tekst):
        //   wit op DEFAULT ......... 21,00:1  ✓  — voor volle vlakken
        //   zwart op DEFAULT ....... 1,00:1   ✗  — nooit donkere tekst op een vlak
        //   DEFAULT op obsidian .... 1,08:1   ✗  — zwart op donker is onzichtbaar
        //   soft    op obsidian .... 17,64:1  ✓  — voor accentTEKST op donker
        //
        // `soft` kan dus niet meer een lichtere variant van het accent zijn,
        // want zwart heeft er geen. Het is nu de blush uit het palet: dat is de
        // enige manier om accenttekst op de donkere secties leesbaar te houden.
        gold: {
          DEFAULT: '#000000',
          soft: 'var(--imv-blush)',
          faint: 'rgba(0, 0, 0, 0.08)',
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
