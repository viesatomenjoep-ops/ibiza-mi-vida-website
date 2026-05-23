'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Ticket, Anchor, MessageCircle } from 'lucide-react'

const navLinks = [
  { label: 'Club Tickets', href: '/club-tickets' },
  { label: 'Boat Parties', href: '/boat-parties' },
  { label: 'Catamaran', href: '/vip-catamaran' },
  { label: 'Formentera', href: '/formentera-boat-trips' },
  { label: 'Blog', href: '/blog' },
]

const mobileBottomLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Clubs', href: '/club-tickets', icon: Ticket },
  { label: 'Boats', href: '/private-boat-charters', icon: Anchor },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34XXXXXXXXX'

  return (
    <>
      {/* Desktop + mobile top bar */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-midnight/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent',
        ].join(' ')}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:h-20"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Ibiza mi vida — home">
            <div className="relative h-8 w-8 md:h-10 md:w-10">
              <Image
                src="/logo.png"
                alt="Ibiza mi vida"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif text-xl font-light text-soft-white md:text-2xl">
              Ibiza <span className="text-teal">mi vida</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-6 lg:flex" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    'font-sans text-sm transition-colors duration-200',
                    pathname === link.href
                      ? 'text-teal'
                      : 'text-soft-white/80 hover:text-soft-white',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/private-boat-charters"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              <Anchor size={14} />
              Private Boats
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex items-center justify-center rounded-full p-2 text-soft-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile full-screen menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/10 bg-midnight/98 lg:hidden"
            >
              <ul className="flex flex-col gap-1 px-4 py-4" role="list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-xl px-4 py-3 font-sans text-base text-soft-white/80 transition-colors hover:bg-white/10 hover:text-soft-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    href="/private-boat-charters"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-teal py-3 font-sans font-semibold text-white"
                  >
                    <Anchor size={16} />
                    Private Boats
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-sandstone/30 bg-midnight/95 pb-safe-bottom backdrop-blur-md lg:hidden"
        aria-label="Mobile bottom navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {mobileBottomLinks.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-col items-center gap-0.5 px-5 py-3 font-sans text-[10px] font-medium uppercase tracking-wide transition-colors',
              pathname === href ? 'text-teal' : 'text-soft-white/60 hover:text-soft-white',
            ].join(' ')}
            aria-current={pathname === href ? 'page' : undefined}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 px-5 py-3 font-sans text-[10px] font-medium uppercase tracking-wide text-teal hover:text-teal-light transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={20} />
          WhatsApp
        </a>
      </nav>
    </>
  )
}
