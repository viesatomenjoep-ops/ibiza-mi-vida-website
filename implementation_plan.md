# Ibiza mi vida — Full Implementation Plan

> Status: Pre-implementation  
> Last updated: 2026-05-22 (rev 2 — clubs & events layer added)  
> Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Framer Motion · Lucide React

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Brand Tokens](#2-brand-tokens)
3. [Tech Stack & Tooling](#3-tech-stack--tooling)
4. [Directory & File Structure](#4-directory--file-structure)
5. [Supabase Schema](#5-supabase-schema)
6. [Routing & SEO Silo Architecture](#6-routing--seo-silo-architecture)
7. [Shared Components](#7-shared-components)
8. [Page-by-Page Specifications](#8-page-by-page-specifications)
9. [Booking Flow](#9-booking-flow)
10. [JSON-LD Schema Strategy](#10-json-ld-schema-strategy)
11. [Performance & Core Web Vitals Strategy](#11-performance--core-web-vitals-strategy)
12. [Implementation Phases](#12-implementation-phases)
13. [Environment Variables](#13-environment-variables)
14. [Decisions Log](#14-decisions-log)

---

## 1. Project Overview

**Ibiza mi vida** is a premium Ibiza-based events, booking, and boat charter agency. The website must:

- Maximize conversions for **Private Boat Charters** (highest-ticket, highest priority silo)
- Capture volume sales for **Club Tickets, Boat Parties, Car/Scooter Rentals**
- Rank for high-intent Ibiza travel keywords via a clean SEO silo structure
- Convert via **WhatsApp** (no inline payment at launch) with lead capture saved to Supabase
- Project a **premium, minimalist, luxury Mediterranean** brand identity

---

## 2. Brand Tokens

All tokens are defined in `tailwind.config.ts` under `theme.extend.colors` and exposed as CSS custom properties in `globals.css`.

| Token Name       | Hex       | Usage                                      |
|------------------|-----------|--------------------------------------------|
| `midnight`       | `#102033` | Primary dark — backgrounds, navbars, hero  |
| `sandstone`      | `#E9DFD2` | Light section backgrounds, card fills      |
| `teal`           | `#169C90` | Accent / Primary CTA color                 |
| `soft-white`     | `#FAF8F4` | Body text on dark, light page bg           |
| `driftwood`      | `#B89F84` | Secondary accent, dividers, warm details   |

**Typography:**
- Headings: `Cormorant Garamond` (Google Fonts — serif, luxury weight)
- Body / UI: `Inter` (Google Fonts — clean, highly legible)

**Spacing system:** Standard Tailwind 4px grid. Key breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

---

## 3. Tech Stack & Tooling

| Layer              | Choice                          | Rationale                                      |
|--------------------|---------------------------------|------------------------------------------------|
| Framework          | Next.js 14 (App Router)         | RSC, ISR, metadata API, sitemap generation     |
| Language           | TypeScript (strict mode)        | Type safety across DB types → components       |
| Styling            | Tailwind CSS v3                 | Atomic utility, minimal CSS footprint          |
| Animation          | Framer Motion                   | Page transitions, scroll reveals, micro UX     |
| Icons              | Lucide React                    | Tree-shakeable, consistent style               |
| Database           | Supabase (PostgreSQL)           | Lead storage, future inventory/reviews         |
| Auth (future)      | Supabase Auth                   | Guest checkout only at launch                  |
| Image optimization | `next/image`                    | WebP auto-conversion, lazy load, LCP priority  |
| Fonts              | `next/font/google`              | Zero layout shift, self-hosted delivery        |
| SEO metadata       | Next.js `Metadata` API          | Static + dynamic `generateMetadata()`          |
| Schema markup      | Inline `<script type="application/ld+json">` | Rich snippets for Events + Products  |
| Sitemap            | `app/sitemap.ts` (native)       | Auto-generated, always up to date              |
| Robots             | `app/robots.ts` (native)        | Correct crawl directives from day one          |
| Linting            | ESLint + Prettier                | Consistent code style                         |

---

## 4. Directory & File Structure

```
ibiza-mi-vida-website/
├── public/
│   ├── logo.svg                          # Client to provide; path hardcoded here
│   ├── og-default.jpg                    # Default Open Graph image (1200×630)
│   └── images/
│       ├── hero-bg.jpg                   # Hero background (high-res, WebP optimized)
│       ├── boats/                        # Boat charter imagery
│       ├── clubs/                        # Club imagery
│       └── placeholders/                 # Dev placeholders
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout — fonts, nav, footer, WhatsApp FAB
│   │   ├── page.tsx                      # / — Homepage
│   │   ├── sitemap.ts                    # Auto-generated sitemap
│   │   ├── robots.ts                     # Crawl directives
│   │   │
│   │   ├── club-tickets/
│   │   │   ├── page.tsx                  # /club-tickets — club grid listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # /club-tickets/[slug] — club detail + events
│   │   │
│   │   ├── guestlist/
│   │   │   └── page.tsx                  # /guestlist
│   │   │
│   │   ├── drink-packages/
│   │   │   └── page.tsx                  # /drink-packages
│   │   │
│   │   ├── private-boat-charters/
│   │   │   └── page.tsx                  # /private-boat-charters [PRIORITY]
│   │   │
│   │   ├── boat-parties/
│   │   │   └── page.tsx                  # /boat-parties
│   │   │
│   │   ├── vip-catamaran/
│   │   │   └── page.tsx                  # /vip-catamaran
│   │   │
│   │   ├── formentera-boat-trips/
│   │   │   └── page.tsx                  # /formentera-boat-trips
│   │   │
│   │   ├── free-discount-ibiza/
│   │   │   └── page.tsx                  # /free-discount-ibiza
│   │   │
│   │   ├── car-scooter-rental/
│   │   │   └── page.tsx                  # /car-scooter-rental
│   │   │
│   │   ├── tips/
│   │   │   └── page.tsx                  # /tips — article listing
│   │   │
│   │   └── blog/
│   │       ├── page.tsx                  # /blog — post listing (ISR)
│   │       └── [slug]/
│   │           └── page.tsx              # /blog/[slug] — individual post (ISR)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Sticky desktop nav + mobile bottom bar
│   │   │   ├── Footer.tsx                # Footer with links, social, legal
│   │   │   └── WhatsAppFAB.tsx           # Floating WhatsApp action button
│   │   │
│   │   ├── hero/
│   │   │   ├── Hero.tsx                  # Full-bleed hero section wrapper
│   │   │   └── SearchWidget.tsx          # 'client' horizontal search bar
│   │   │
│   │   ├── cards/
│   │   │   ├── CategoryCard.tsx          # Vertical luxury card (500px min-height)
│   │   │   ├── CategoryGrid.tsx          # Responsive grid wrapper
│   │   │   ├── ClubCard.tsx              # Club venue card — links to /club-tickets/[slug]
│   │   │   ├── EventCard.tsx             # Individual event row/card on club detail page
│   │   │   └── CrossSellBanner.tsx       # Contextual private boat upsell banner
│   │   │
│   │   ├── booking/
│   │   │   ├── BookingModal.tsx          # Modal: first name, last name, email → Supabase → WhatsApp
│   │   │   └── BookingForm.tsx           # Form fields inside modal
│   │   │
│   │   ├── seo/
│   │   │   ├── EventSchema.tsx           # JSON-LD: Event schema injector (reused per event)
│   │   │   ├── ProductSchema.tsx         # JSON-LD: Product/Service schema injector
│   │   │   └── LocalBusinessSchema.tsx   # JSON-LD: LocalBusiness for homepage
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx                # Reusable pill button (teal / dark variants)
│   │       ├── SectionHeader.tsx         # Consistent section title + subtitle block
│   │       └── AnimatedSection.tsx       # Framer Motion scroll-reveal wrapper
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser Supabase client (singleton)
│   │   │   └── server.ts                 # Server Supabase client (RSC / API routes)
│   │   ├── whatsapp.ts                   # WhatsApp deep-link URL builder utility
│   │   └── metadata.ts                   # Shared metadata factory helper
│   │
│   ├── types/
│   │   ├── booking.ts                    # BookingLead, BookingStatus types
│   │   ├── blog.ts                       # BlogPost type matching Supabase row
│   │   ├── club.ts                       # Club, ClubEvent, BookingType types
│   │   └── experience.ts                 # Experience/service type
│   │
│   └── styles/
│       └── globals.css                   # CSS custom properties, base resets
│
├── .env.local                            # Supabase keys (gitignored)
├── .env.example                          # Safe template committed to git
├── tailwind.config.ts                    # Brand token extensions
├── next.config.ts                        # Image domains, ISR config
├── tsconfig.json                         # Strict TypeScript config
└── implementation_plan.md               # This file
```

---

## 5. Supabase Schema

### 5a. Tables

#### `booking_leads`
Captures every lead before WhatsApp redirect. This is the primary conversion tracking table.

```sql
CREATE TABLE booking_leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  service_type TEXT NOT NULL,         -- e.g. 'private-boat-charter', 'club-tickets'
  service_name TEXT,                  -- human-readable e.g. 'Ocean Dream Charter'
  arrival_date DATE,                  -- from search widget date picker
  message      TEXT,                  -- optional freetext from form
  source_page  TEXT,                  -- referring silo URL
  utm_source   TEXT,                  -- UTM tracking
  utm_medium   TEXT,
  utm_campaign TEXT,
  status       TEXT NOT NULL DEFAULT 'new'  -- new | contacted | booked | lost
);
```

#### `experiences`
ISR-powered content for all category pages. Drives the card grids.

```sql
CREATE TABLE experiences (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug         TEXT UNIQUE NOT NULL,
  category     TEXT NOT NULL,   -- 'boat-charter' | 'club-ticket' | 'boat-party' | 'catamaran' | 'formentera' | 'car-rental'
  title        TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  image_url    TEXT,
  price_from   NUMERIC(10,2),
  currency     TEXT DEFAULT 'EUR',
  duration     TEXT,            -- e.g. '4 hours', 'Full day'
  capacity     INTEGER,         -- max group size
  available    BOOLEAN DEFAULT TRUE,
  featured     BOOLEAN DEFAULT FALSE,
  sort_order   INTEGER DEFAULT 0
);
```

#### `blog_posts`
Content engine for `/blog/[slug]` and `/tips`.

```sql
CREATE TABLE blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  content      TEXT,            -- Markdown stored here
  cover_image  TEXT,
  category     TEXT,            -- 'tips' | 'guides' | 'nightlife' | 'boats'
  published    BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ
);
```

#### `clubs`
One row per venue. Drives the `/club-tickets` grid and each `/club-tickets/[slug]` page.

```sql
CREATE TABLE clubs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug             TEXT UNIQUE NOT NULL,   -- e.g. 'pacha', 'amnesia', 'hi-ibiza'
  name             TEXT NOT NULL,          -- e.g. 'Pacha Ibiza'
  tagline          TEXT,                   -- short descriptor shown on card
  description      TEXT,                   -- longer copy for the club detail page
  image_url        TEXT,                   -- hero/card image
  logo_url         TEXT,                   -- optional club logo
  booking_type     TEXT NOT NULL           -- 'promoter_link' | 'whatsapp'
                   CHECK (booking_type IN ('promoter_link', 'whatsapp')),
  promoter_url     TEXT,                   -- populated only when booking_type = 'promoter_link'
  location         TEXT,                   -- e.g. 'Sant Rafel de Sa Creu, Ibiza'
  capacity         INTEGER,
  music_genre      TEXT,                   -- e.g. 'House, Techno'
  active           BOOLEAN DEFAULT TRUE,
  sort_order       INTEGER DEFAULT 0
);
```

**Seed data — 14 clubs:**

| slug | name | booking_type | notes |
|------|------|-------------|-------|
| `amnesia` | Amnesia | `promoter_link` | Own promoter URL to be provided |
| `pacha` | Pacha Ibiza | `promoter_link` | Own promoter URL to be provided |
| `universe` | Universe | `whatsapp` | Ibiza mi vida WhatsApp |
| `ushaia` | Ushaia Ibiza | `whatsapp` | |
| `hi-ibiza` | Hi Ibiza | `whatsapp` | |
| `playa-soleil` | Playa Soleil | `whatsapp` | |
| `o-beach` | O Beach Ibiza | `whatsapp` | |
| `bam-bu-ku` | Bam-Bu-Ku | `whatsapp` | |
| `chinois` | Chinois | `whatsapp` | |
| `ibiza-rocks` | Ibiza Rocks | `whatsapp` | |
| `eden` | Eden Ibiza | `whatsapp` | |
| `es-paradis` | Es Paradis | `whatsapp` | |
| `528-ibiza` | 528 Ibiza | `whatsapp` | |
| `swag-ibiza` | Swag Ibiza | `whatsapp` | |
| `lio` | Lío Ibiza | `whatsapp` | |

#### `events`
Individual events linked to a club. Drives the event listing on each club detail page.

```sql
CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  club_id          UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,          -- e.g. 'Damian Lazarus presents Lazarus'
  slug             TEXT UNIQUE NOT NULL,   -- e.g. 'amnesia-damian-lazarus-2026-07-15'
  description      TEXT,
  image_url        TEXT,
  event_date       DATE NOT NULL,
  doors_open       TIME,                   -- e.g. '23:00'
  price_from       NUMERIC(10,2),
  currency         TEXT DEFAULT 'EUR',
  lineup           TEXT[],                 -- array of artist names
  genre_tags       TEXT[],                 -- e.g. ['House', 'Melodic Techno']
  booking_type     TEXT NOT NULL           -- inherits from club but can override
                   CHECK (booking_type IN ('promoter_link', 'whatsapp')),
  promoter_url     TEXT,                   -- override for this specific event if needed
  sold_out         BOOLEAN DEFAULT FALSE,
  featured         BOOLEAN DEFAULT FALSE,
  published        BOOLEAN DEFAULT FALSE
);
```

#### `reviews`
Used in JSON-LD aggregated ratings for the boats page.

```sql
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  experience_id UUID REFERENCES experiences(id),
  reviewer_name TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         TEXT,
  verified     BOOLEAN DEFAULT FALSE,
  published    BOOLEAN DEFAULT FALSE
);
```

### 5b. Row Level Security (RLS) Policies

```sql
-- booking_leads: anyone can INSERT, only authenticated admin can SELECT
ALTER TABLE booking_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON booking_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin select" ON booking_leads FOR SELECT USING (auth.role() = 'authenticated');

-- experiences: anyone can read published entries
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON experiences FOR SELECT USING (available = true);

-- blog_posts: anyone can read published posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON blog_posts FOR SELECT USING (published = true);

-- clubs: anyone can read active clubs
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON clubs FOR SELECT USING (active = true);

-- events: anyone can read published events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON events FOR SELECT USING (published = true);

-- reviews: anyone can read verified published reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON reviews FOR SELECT USING (published = true AND verified = true);
```

---

## 6. Routing & SEO Silo Architecture

| Route                         | Rendering  | ISR TTL | Primary Keyword Target                            | Priority |
|-------------------------------|------------|---------|---------------------------------------------------|----------|
| `/`                           | ISR        | 3600s   | Ibiza events booking, Ibiza mi vida               | High     |
| `/private-boat-charters`      | ISR        | 1800s   | Private boat charter Ibiza, luxury yacht          | **MAX**  |
| `/club-tickets`               | ISR        | 1800s   | Ibiza club tickets, venue bookings                | High     |
| `/club-tickets/amnesia`       | ISR        | 3600s   | Amnesia Ibiza tickets, Amnesia club events        | High     |
| `/club-tickets/pacha`         | ISR        | 3600s   | Pacha Ibiza tickets, Pacha club events            | High     |
| `/club-tickets/hi-ibiza`      | ISR        | 3600s   | Hi Ibiza tickets, Hi club Ibiza                   | High     |
| `/club-tickets/ushaia`        | ISR        | 3600s   | Ushaia Ibiza tickets, Ushaia beach club           | High     |
| `/club-tickets/universe`      | ISR        | 3600s   | Universe Ibiza tickets                            | Medium   |
| `/club-tickets/o-beach`       | ISR        | 3600s   | O Beach Ibiza tickets, O Beach pool party         | Medium   |
| `/club-tickets/ibiza-rocks`   | ISR        | 3600s   | Ibiza Rocks tickets, Ibiza Rocks hotel            | Medium   |
| `/club-tickets/es-paradis`    | ISR        | 3600s   | Es Paradis tickets, Es Paradis Ibiza              | Medium   |
| `/club-tickets/eden`          | ISR        | 3600s   | Eden Ibiza tickets, Eden club San Antonio         | Medium   |
| `/club-tickets/playa-soleil`  | ISR        | 3600s   | Playa Soleil Ibiza tickets                        | Medium   |
| `/club-tickets/bam-bu-ku`     | ISR        | 3600s   | Bam-Bu-Ku Ibiza tickets                           | Medium   |
| `/club-tickets/chinois`       | ISR        | 3600s   | Chinois Ibiza tickets                             | Medium   |
| `/club-tickets/528-ibiza`     | ISR        | 3600s   | 528 Ibiza tickets                                 | Medium   |
| `/club-tickets/swag-ibiza`    | ISR        | 3600s   | Swag Ibiza tickets                                | Medium   |
| `/club-tickets/lio`           | ISR        | 3600s   | Lío Ibiza tickets, Lío cabaret restaurant         | Medium   |
| `/boat-parties`               | ISR        | 1800s   | Ibiza boat party tickets                          | High     |
| `/vip-catamaran`              | ISR        | 3600s   | VIP catamaran cruise Ibiza                        | Medium   |
| `/formentera-boat-trips`      | ISR        | 3600s   | Formentera day trip boat                          | Medium   |
| `/guestlist`                  | SSG        | —       | Ibiza club guestlist, free entry                  | Medium   |
| `/drink-packages`             | SSG        | —       | VIP bottle service Ibiza, drinks packages         | Medium   |
| `/car-scooter-rental`         | SSG        | —       | Rent a scooter Ibiza, cheap car hire              | Medium   |
| `/free-discount-ibiza`        | SSG        | —       | Cheap things to do Ibiza, discount passes         | Low      |
| `/tips`                       | ISR        | 3600s   | Ibiza tips, what to do in Ibiza                   | Medium   |
| `/blog/[slug]`                | ISR        | 3600s   | Long-tail informational keywords                  | Medium   |

> **Note on `generateStaticParams`**: At build time, `club-tickets/[slug]` calls Supabase to fetch all active club slugs and pre-renders all 14 pages. ISR revalidates them every 3600s to pick up new events without a rebuild.

### Metadata Strategy (per page)

Each page exports a `generateMetadata()` function (or static `metadata` object) covering:
- `title`: `{Page Title} | Ibiza mi vida`
- `description`: 150–160 characters, keyword-first
- `canonical`: absolute URL
- `openGraph`: title, description, image (1200×630), type
- `twitter`: card type, image, site handle

---

## 7. Shared Components

### 7a. `Navbar.tsx`
- **Desktop**: Sticky, `backdrop-blur-md`, logo left, nav links center, "Private Boats" CTA button right (teal bg, white text, rounded-full)
- **Mobile**: Top bar with logo only + hamburger; **bottom-pinned nav bar** with 4 icon+label shortcuts: Home, Boats, Tickets, WhatsApp
- Transparent on hero, switches to `midnight` bg on scroll (Framer Motion `useScroll`)
- Logo: `<Image src="/logo.svg" />` — client to provide file

### 7b. `Footer.tsx`
- 3-column grid: Brand/tagline | Quick links by silo | Contact + social
- Background: `midnight`, text: `soft-white`
- Legal row: © Ibiza mi vida, Privacy Policy, Cookie Policy
- WhatsApp number, Instagram handle

### 7c. `WhatsAppFAB.tsx`
- Fixed bottom-right, `z-50`
- Teal circle button with Lucide `MessageCircle` icon
- On click: opens `https://wa.me/+34XXXXXXXXX` in new tab (test number placeholder)
- Subtle pulse animation via Framer Motion to draw attention
- Tooltip on hover: "Chat with us on WhatsApp"

### 7d. `CategoryCard.tsx`
- **Height**: `min-h-[500px]`, full-bleed `next/image` background
- **Corners**: `rounded-3xl`, `overflow-hidden`
- **Hover**: `group-hover:scale-105 transition-transform duration-500` on the image
- **Overlay**: `bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent`
- **Text**: Absolutely positioned bottom-left, title in Cormorant Garamond, tagline in Inter
- **CTA**: Pill button bottom — teal bg, white text, `ArrowRight` icon from Lucide
- **On click**: Opens `BookingModal`

### 7e. `BookingModal.tsx`
Full-screen overlay modal (Framer Motion `AnimatePresence`):
1. **Fields**: First Name, Last Name, Email Address, optional Message
2. **On submit**: 
   - Validates inputs client-side
   - POSTs lead to Supabase `booking_leads` table via server action
   - Builds WhatsApp deep-link URL with pre-filled message
   - Redirects to WhatsApp in new tab
   - Shows success confirmation state
3. **Accessibility**: `role="dialog"`, `aria-modal="true"`, focus trap, `Escape` to close

### 7f. `SearchWidget.tsx` (client component)
- Horizontal pill bar, `backdrop-blur-md`, `rounded-full` outer shell
- **Field 1** — "What are you planning?": `<select>` with options:
  - Private Boat Charter (default)
  - Club Tickets
  - Boat Parties
  - Car & Scooter Rental
- **Field 2** — "When are you arriving?": `<input type="date">` native
- **Submit**: Black pill button `→` — redirects to category page + `?date=YYYY-MM-DD` query param
- No JS framework dependency — standard form submit with `router.push()`

### 7g. `CrossSellBanner.tsx`
Reusable contextual upsell injected on lower-ticket pages:
- Dark `midnight` background, teal accent line top
- Headline: "Make it exclusive — Private Yacht Charter from €X"
- Body: 1-2 lines on group pricing advantage
- CTA: "Enquire Now" → opens `BookingModal` with `service_type: 'private-boat-charter'` pre-filled
- Props: `{ triggerPage: string; fromPrice: number }`

### 7h. `ClubCard.tsx`
Displayed in the grid on `/club-tickets`. Clicking navigates to `/club-tickets/[slug]`.
- Same luxury card architecture as `CategoryCard` (`min-h-[400px]`, `rounded-3xl`, full-bleed image, gradient overlay)
- Bottom-left text: club name (Cormorant Garamond), genre tags (Inter, small caps, driftwood color)
- Bottom CTA pill: "See Events →" — navigates to club detail page via `next/link` (no modal)
- Badge: if `booking_type === 'promoter_link'`, show a small "Official Tickets" pill badge top-right
- Props: `{ club: Club }` — fully typed from `types/club.ts`

### 7i. `EventCard.tsx`
Displayed in the event list on `/club-tickets/[slug]`. One row per upcoming event.
- Horizontal card layout on desktop, stacked on mobile
- Left: event `image_url` thumbnail (`rounded-2xl`, fixed aspect ratio)
- Center: Event title, date (formatted "Fri 15 Aug 2026"), doors open time, lineup artists, genre tags
- Right: Price badge ("From €25") + CTA button — behavior forks on `booking_type`:
  - **`promoter_link`**: Button text "Get Tickets" → `<a href={promoter_url} target="_blank" rel="noopener noreferrer">` — no modal, no Supabase insert
  - **`whatsapp`**: Button text "Book via WhatsApp" → opens `BookingModal` with event name + club pre-filled
- "Sold Out" state: button disabled, red badge overlay on thumbnail
- Props: `{ event: ClubEvent; clubName: string }`

### 7j. SEO Schema Components
- `EventSchema.tsx` — injected on `/club-tickets`, `/boat-parties`, specific event pages
- `ProductSchema.tsx` — injected on `/private-boat-charters`, `/vip-catamaran`, `/formentera-boat-trips`
- `LocalBusinessSchema.tsx` — injected on `/` homepage only
- All render a `<script type="application/ld+json">` tag inside a Next.js `<Head>` equivalent

---

## 8. Page-by-Page Specifications

### `/` — Homepage
**Sections (top to bottom):**
1. `Hero` — Full-bleed ocean image, H1, subheadline, `SearchWidget` embedded
2. **Category Grid** — 6 `CategoryCard` components: Boats (featured, larger), Club Tickets, Boat Parties, Catamaran, Formentera, Car Rental
3. **Why Ibiza mi vida** — Trust signals: 3-column icon + text (500+ Happy Guests, 5-Star Reviews, Instant WhatsApp Support)
4. **Featured Experiences** — ISR-fetched top 3 from `experiences` table (featured = true)
5. **Blog Preview** — Latest 3 posts from `blog_posts` table
6. `CrossSellBanner` — Private Boats upsell
7. `Footer`

**Schema**: `LocalBusinessSchema` (name: "Ibiza mi vida", service area: Ibiza, aggregateRating from reviews table)

---

### `/private-boat-charters` — PRIORITY PAGE
**Sections:**
1. **Hero** — Dedicated boat hero image, H1: `Private Boat Charter Ibiza`, keyword-rich subheadline
2. **USP Strip** — 4 icon pillars: Custom Routes · Catering Included · Experienced Crew · Instant WhatsApp Booking
3. **Charter Cards Grid** — ISR-fetched: all experiences where `category = 'boat-charter'`
4. **How It Works** — 3-step numbered flow: 1. Choose your boat → 2. Tell us your plans → 3. We handle everything
5. **Pricing Section** — "From €X per charter" with group size calculator hint
6. **Reviews Strip** — ISR-fetched from `reviews` table, star ratings rendered
7. **Sticky CTA** — Fixed bottom bar on mobile: "Book Your Private Boat — Chat on WhatsApp"
8. `Footer`

**Schema**: `ProductSchema` (name: "Private Boat Charter Ibiza", brand: "Ibiza mi vida", aggregateRating, offers: priceFrom)

---

### `/club-tickets`
The category landing page — a venue directory showing all 14 clubs.

**Sections:**
1. **Hero** — H1: `Ibiza Club Tickets`, subheadline, background club imagery
2. **Club Grid** — ISR-fetched: all active clubs from `clubs` table, rendered as `ClubCard` components (3-col desktop, 2-col tablet, 1-col mobile). Each card links to `/club-tickets/[slug]`
3. **How It Works** — 3-step: Pick your club → Fill your details → We confirm via WhatsApp
4. `CrossSellBanner` — Private Boats upsell
5. `Footer`

**Rendering**: ISR, revalidate 1800s  
**Schema**: `EventSchema` array — one entry per featured upcoming event across all clubs

---

### `/club-tickets/[slug]` — Club Detail Page
Individual venue page. Ranks for "[Club Name] Ibiza tickets" queries.

**`generateStaticParams()`**: Fetches all 14 club slugs from Supabase at build time.  
**`generateMetadata()`**: Dynamically generates per-club metadata:
- title: `{Club Name} Ibiza Tickets 2026 | Ibiza mi vida`
- description: `Buy {Club Name} tickets and get on the guestlist in Ibiza. Browse upcoming events at {Club Name} and book instantly via WhatsApp with Ibiza mi vida.`
- OG image: club's `image_url`

**Sections:**
1. **Club Hero** — Full-bleed club image, club name (H1), tagline, genre tags, location
2. **About the Club** — 2–3 paragraph description of the venue, what to expect, music style
3. **Upcoming Events** — ISR-fetched from `events` table where `club_id = club.id AND event_date >= today AND published = true`, ordered by `event_date ASC`. Rendered as `EventCard` rows. Empty state: "No events scheduled yet — contact us for availability"
4. **Booking strip** — Conditional:
   - If `booking_type === 'promoter_link'`: Banner: "Official tickets available — book directly via the promoter" + external link button
   - If `booking_type === 'whatsapp'`: Banner: "Book your tickets via WhatsApp — instant confirmation" + button opens `BookingModal`
5. `CrossSellBanner` — Private Boats upsell
6. `Footer`

**Rendering**: ISR, revalidate 3600s  
**Schema**: Multiple `EventSchema` blocks — one injected per upcoming event on the page (enables Google rich results for each event in search)

---

### `/guestlist`
**Sections:** Hero · Explainer (what is a guestlist) · Venue List · FAQ · Footer
**Rendering**: SSG (static content)

---

### `/drink-packages`
**Sections:** Hero · Package Cards · CrossSellBanner · Footer
**Rendering**: SSG

---

### `/boat-parties`
**Sections:** Hero · Party Cards Grid (ISR) · CrossSellBanner · Footer
**Schema**: `EventSchema`

---

### `/vip-catamaran`
**Sections:** Hero · Experience Cards (ISR) · Inclusions list · CrossSellBanner · Footer
**Schema**: `ProductSchema`

---

### `/formentera-boat-trips`
**Sections:** Hero · Trip Cards (ISR) · What's included · CrossSellBanner · Footer
**Schema**: `ProductSchema`

---

### `/free-discount-ibiza`
**Sections:** Hero · Deals/tips list · CrossSellBanner · Footer
**Rendering**: SSG

---

### `/car-scooter-rental`
**Sections:** Hero · Fleet cards · How to book · CrossSellBanner · Footer
**Rendering**: SSG

---

### `/tips`
**Sections:** Hero · Article grid (ISR, from blog_posts where category = 'tips') · Footer

---

### `/blog` + `/blog/[slug]`
**`/blog`**: ISR list of all published posts  
**`/blog/[slug]`**: ISR individual post, Markdown rendered, CrossSellBanner injected mid-content  
**`generateStaticParams()`**: Pre-renders all published slugs at build time

---

## 9. Booking Flow

There are two distinct booking paths depending on the venue/service `booking_type`.

### Path A — WhatsApp booking (all services except Amnesia/Pacha)

```
User clicks "Book via WhatsApp" / "Book Now" / "Enquire"
    │
    ▼
BookingModal opens (Framer Motion overlay)
    │
    ├─ Pre-filled (hidden): service_type, service_name, club_name (if applicable)
    ├─ User fills: First Name · Last Name · Email · (optional) Message
    │
    ▼
Client-side validation (required fields)
    │
    ▼
Server Action: INSERT into supabase.booking_leads
  { first_name, last_name, email, message,
    service_type, service_name, arrival_date,
    source_page, utm_source, utm_medium, utm_campaign }
    │
    ▼
Build WhatsApp deep-link:
  https://wa.me/+34XXXXXXXXX?text={encoded message}
    │
    ▼
window.open(whatsAppURL, '_blank')
    │
    ▼
Modal → success state: "Thank you, {firstName}! We'll reply within minutes."
```

### Path B — Promoter link (Amnesia, Pacha)

```
User clicks "Get Tickets" on an Amnesia or Pacha EventCard
    │
    ▼
Direct <a href={promoter_url} target="_blank" rel="noopener noreferrer">
    │
    ▼
User lands on club's own ticketing platform
    │
    (No Supabase insert — no lead capture needed for external redirect)
```

> **Important**: For clubs with `booking_type = 'promoter_link'`, the `EventCard` renders a plain anchor tag. No modal is shown. The `promoter_url` is stored per-event in the `events` table so it can be overridden event-by-event even for WhatsApp clubs if needed.

### WhatsApp message template
```
Hi Ibiza mi vida! I'm {firstName} {lastName} and I'd like to book:

Service: {serviceName}
Date: {arrivalDate}
{message ? `Message: ${message}` : ''}

My email: {email}
```

---

## 10. JSON-LD Schema Strategy

### LocalBusiness (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ibiza mi vida",
  "url": "https://ibizamivida.com",
  "telephone": "+34XXXXXXXXX",
  "address": { "@type": "PostalAddress", "addressLocality": "Ibiza", "addressCountry": "ES" },
  "geo": { "@type": "GeoCoordinates", "latitude": 38.9067, "longitude": 1.4206 },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" },
  "priceRange": "€€€"
}
```

### Product/Service (Private Boats page)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Private Boat Charter Ibiza",
  "brand": { "@type": "Brand", "name": "Ibiza mi vida" },
  "description": "Exclusive private boat charters around Ibiza...",
  "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "500", "availability": "https://schema.org/InStock" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "87" }
}
```

### Event (Club detail pages — `/club-tickets/[slug]`)
One `EventSchema` block is injected per upcoming event on each club page. Multiple JSON-LD blocks are valid and Google will index each event separately, enabling rich event results.

```json
{
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  "name": "{Event Title}",
  "startDate": "{ISO 8601 — e.g. 2026-07-15T23:00:00+02:00}",
  "location": {
    "@type": "Place",
    "name": "{Club Name}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ibiza",
      "addressCountry": "ES"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Ibiza mi vida",
    "url": "https://ibizamivida.com"
  },
  "performer": [
    { "@type": "MusicGroup", "name": "{Artist 1}" },
    { "@type": "MusicGroup", "name": "{Artist 2}" }
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "{price_from}",
    "availability": "https://schema.org/InStock",
    "validFrom": "{created_at ISO}",
    "url": "https://ibizamivida.com/club-tickets/{club-slug}"
  },
  "image": "{event image_url}",
  "description": "{event description}"
}
```

> **`MusicEvent` vs `Event`**: Use `MusicEvent` (a subtype of `Event`) for club nights — Google's rich results docs specifically list it for entertainment events and it improves click-through with event carousels in SERPs.

### Venue schema (per club detail page)
```json
{
  "@context": "https://schema.org",
  "@type": "NightClub",
  "name": "{Club Name}",
  "url": "https://ibizamivida.com/club-tickets/{slug}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ibiza",
    "addressCountry": "ES"
  },
  "image": "{club image_url}",
  "description": "{club description}"
}
```

---

## 11. Performance & Core Web Vitals Strategy

| Metric | Target | Implementation                                             |
|--------|--------|------------------------------------------------------------|
| LCP    | < 2.5s | Hero image: `priority` prop on `next/image`, preload hint  |
| CLS    | < 0.1  | Fixed aspect ratios on all images (`aspect-ratio` CSS)     |
| INP    | < 200ms| No heavy client bundles; modal lazy-loaded                 |
| TTFB   | < 600ms| ISR caching; Supabase queries on server only               |

**Additional optimizations:**
- `next/font` self-hosting for Cormorant Garamond + Inter — zero external font request
- All `next/image` sizes specified — no layout shift from unsized images
- Framer Motion: `LazyMotion` + `domAnimation` feature bundle only (< 5kb)
- No CSS-in-JS — pure Tailwind means zero runtime style computation
- `SearchWidget` is the only `'use client'` component in the hero; everything else is RSC
- `BookingModal` dynamically imported with `next/dynamic` — not in initial bundle

---

## 12. Implementation Phases

### Phase 1 — Foundation (current scope)
- [ ] Initialize Next.js 14 project with TypeScript + Tailwind inside `/ibiza-mi-vida-website`
- [ ] Configure `tailwind.config.ts` with brand tokens
- [ ] Set up `next/font` for Cormorant Garamond + Inter
- [ ] Configure `next.config.ts` (image domains, strict mode)
- [ ] Create Supabase project + run schema migrations
- [ ] Set up `.env.local` / `.env.example`
- [ ] Build `globals.css` with CSS custom properties

### Phase 2 — Shared Components
- [ ] `Navbar.tsx` — desktop + mobile bottom bar
- [ ] `Footer.tsx`
- [ ] `WhatsAppFAB.tsx`
- [ ] `Button.tsx`, `SectionHeader.tsx`, `AnimatedSection.tsx`
- [ ] `CategoryCard.tsx` + `CategoryGrid.tsx`
- [ ] `ClubCard.tsx` — venue card linking to club detail page
- [ ] `EventCard.tsx` — event row with booking_type fork (promoter link vs WhatsApp modal)
- [ ] `BookingModal.tsx` + `BookingForm.tsx`
- [ ] `SearchWidget.tsx`
- [ ] `CrossSellBanner.tsx`
- [ ] Schema components: `EventSchema` (MusicEvent), `ProductSchema`, `LocalBusinessSchema`, `VenueSchema`

### Phase 3 — All Page Routes (scaffold + metadata)
- [ ] `/` Homepage — full section layout
- [ ] `/private-boat-charters` — full implementation
- [ ] `/club-tickets` — club grid listing (all 14 clubs via ClubCard)
- [ ] `/club-tickets/[slug]` — club detail page with events, dual booking_type logic, per-event EventSchema
- [ ] Supabase seed: all 14 clubs with correct slugs, names, booking_type, promoter_url (Amnesia + Pacha)
- [ ] `/boat-parties` — full implementation
- [ ] `/vip-catamaran` — section structure
- [ ] `/formentera-boat-trips` — section structure
- [ ] `/guestlist` — SSG page
- [ ] `/drink-packages` — SSG page
- [ ] `/car-scooter-rental` — SSG page
- [ ] `/free-discount-ibiza` — SSG page
- [ ] `/tips` — listing page
- [ ] `/blog` + `/blog/[slug]` — ISR pages

### Phase 4 — SEO Infrastructure
- [ ] `app/sitemap.ts` — dynamic from Supabase slugs
- [ ] `app/robots.ts`
- [ ] All `generateMetadata()` functions per page
- [ ] JSON-LD schema injected on correct pages

### Phase 5 — Polish & QA
- [ ] Framer Motion animations: hero entrance, card hovers, modal transitions, scroll reveals
- [ ] Core Web Vitals audit (Lighthouse CI)
- [ ] Cross-browser / responsive QA (mobile bottom nav, card grid breakpoints)
- [ ] Accessibility audit (ARIA labels, focus traps, color contrast ratios)
- [ ] Replace all placeholder images with client assets
- [ ] Seed Supabase with initial `experiences` and `blog_posts` data

---

## 13. Environment Variables

```bash
# .env.example (safe to commit)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never public
NEXT_PUBLIC_WHATSAPP_NUMBER=+34XXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://ibizamivida.com
```

---

## 14. Decisions Log

| Decision                         | Choice                         | Reason                                                   |
|----------------------------------|--------------------------------|----------------------------------------------------------|
| Payment at launch                | None — WhatsApp redirect       | High-ticket charters convert better via direct chat      |
| Lead capture before WhatsApp     | Name + Email → Supabase first  | CRM foundation; tracks source without payment gateway    |
| Multilingual                     | English only (phase 1)         | Launch velocity; i18n can be added via next-intl later   |
| Logo format                      | SVG (client to provide)        | Scalable, no quality loss on retina; placeholder used now|
| Blog/CMS authorship              | Supabase markdown              | No extra CMS service; admin UI can be added later        |
| User accounts                    | None at launch                 | Guest-only flow; Supabase Auth reserved for phase 2      |
| /transfers silo                  | Excluded (user decision)       | Keep original 11 silos only                              |
| Font pairing                     | Cormorant Garamond + Inter     | Luxury serif + clean sans; self-hosted via next/font     |
| Animation library                | Framer Motion (LazyMotion)     | Specified in brief; bundle-optimized feature subset      |
| Floating WhatsApp button         | Yes — test number placeholder  | High-converting for Ibiza market                         |
| Club pages routing               | `/club-tickets/[slug]`         | Keeps SEO authority within the club-tickets silo         |
| Amnesia + Pacha booking type     | `promoter_link` — no modal     | They have own ticketing; no lead capture for externals   |
| All other clubs booking type     | `whatsapp` — modal + Supabase  | Ibiza mi vida owns the booking relationship              |
| Club event schema type           | `MusicEvent` (not generic Event)| Google's event carousel specifically lists this subtype |
| Event data structure             | `events` table with `club_id`  | Clean relational model; events inherit club booking_type |
