// ─────────────────────────────────────────────────────────────────────────────
// ClubTickets description parser
//
// The CT "description" field is rich HTML with a consistent structure:
//   .included-row > .chip           → quick-fact pills ("Open bar", "Lunch", …)
//   .trip-ticket (.eyebrow/.main/.meta span)  → summary ticket line
//   <heading text>  <div class="contenido"> .cubiculo-lista > .cubiculo …  → sections
//   .itinerary-block > .list > .item (.h / .sub)  → a route/timeline
//
// Many events (129/173) have no structure at all — just paragraphs. We detect
// that and fall back to clean paragraphs, so every event renders nicely.
// ─────────────────────────────────────────────────────────────────────────────

export interface CTSection {
  title: string;
  items: string[];
}
export interface CTStop {
  time?: string;
  title: string;
  sub?: string;
}
export interface CTDescription {
  hasStructure: boolean;
  intro: string[];          // plain paragraphs
  chips: string[];          // quick-fact pills
  sections: CTSection[];    // titled bullet cards (excludes the itinerary)
  itinerary: CTStop[];      // route / timeline stops
}

// ── low-level helpers ─────────────────────────────────────────────────────────
function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;|&#39;|&#039;|&apos;/g, '’')
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&lsquo;/g, '‘')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&eacute;/g, 'é')
    .replace(/&aacute;/g, 'á')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ');
}

function strip(html: string): string {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull the text of the first tag with the given class inside `block`. */
function pickClass(block: string, cls: string): string {
  const m = block.match(new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/`, 'i'));
  return m ? strip(m[1]) : '';
}

/** A time token like "9:15 AM", "13:00", "6:30 PM". */
const TIME_RE = /\b(\d{1,2}[:.]\d{2}\s*(?:AM|PM|am|pm|h)?)\b/;

function splitTime(heading: string): { time?: string; title: string } {
  // "1:00 PM · Port…" or "Return · 5:30 PM" → time + title ; "Departure point" → title only
  const parts = heading.split('·').map(p => p.trim());
  if (parts.length > 1) {
    const idx = parts.findIndex(p => p.length <= 10 && /^\d/.test(p) && TIME_RE.test(p));
    if (idx >= 0) {
      const title = parts.filter((_, i) => i !== idx).join(' · ').trim();
      return { time: parts[idx], title };
    }
  }
  const m = heading.match(new RegExp(`^${TIME_RE.source}[\\s·—-]+(.+)$`));
  if (m) return { time: m[1], title: m[2].trim() };
  return { title: heading };
}

// ── main parser ───────────────────────────────────────────────────────────────
export function parseCTDescription(raw?: string): CTDescription {
  const empty: CTDescription = { hasStructure: false, intro: [], chips: [], sections: [], itinerary: [] };
  if (!raw || !raw.trim()) return empty;

  // Drop the promo tail & any style/script.
  let html = raw.split('.promo-hz')[0]
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  const hasStructure = /class="contenido"|itinerary-block|class="chip"|trip-ticket/.test(html);

  // Strip the decorative icon spans so nested chips parse cleanly.
  html = html.replace(/<span class="icon">[\s\S]*?<\/span>/gi, '');

  // ── plain fallback: split into paragraphs ──
  if (!hasStructure) {
    const paras = html
      .replace(/<\/(p|div|h[1-6])>/gi, '\n\n')
      .replace(/<br\s*\/?>(\s*<br\s*\/?>)+/gi, '\n\n')
      .split(/\n\n+/)
      .map(strip)
      .filter(p => p.length > 1);
    return { ...empty, intro: paras };
  }

  // ── chips (quick facts) ──
  const chips: string[] = [];
  const chipRe = /<span class="chip">([\s\S]*?)<\/span>/gi;
  let cm: RegExpExecArray | null;
  while ((cm = chipRe.exec(html))) {
    const t = strip(cm[1].replace(/<span class="icon">[\s\S]*?<\/span>/gi, ''));
    if (t) chips.push(t);
  }

  // ── intro paragraphs: <p> that aren't .sub ──
  const intro: string[] = [];
  const pRe = /<p(?![^>]*class="sub")[^>]*>([\s\S]*?)<\/p>/gi;
  let pm: RegExpExecArray | null;
  while ((pm = pRe.exec(html))) {
    const t = strip(pm[1]);
    if (t.length > 2) intro.push(t);
  }

  // ── sections: split on each .contenido; the heading is the tail text before it ──
  const sections: CTSection[] = [];
  let itinerary: CTStop[] = [];
  const segments = html.split(/<div class="contenido">/i);
  for (let i = 1; i < segments.length; i++) {
    const before = segments[i - 1];
    const body = segments[i];

    // heading = last meaningful text line of the previous segment
    const beforeText = before
      .replace(/<div class="trip-ticket">[\s\S]*?<\/div>\s*<br/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '\n');
    const lines = decode(beforeText).split('\n').map(l => l.trim()).filter(Boolean);
    let title = lines.length ? lines[lines.length - 1] : '';
    title = title.replace(/[:?]\s*$/, '').trim();

    if (/itinerary-block/i.test(body)) {
      const itemRe = /<div class="item">([\s\S]*?)(?=<div class="item">|<\/div>\s*<\/div>\s*<\/div>|$)/gi;
      let im: RegExpExecArray | null;
      const stops: CTStop[] = [];
      while ((im = itemRe.exec(body))) {
        const h = pickClass(im[1], 'h');
        const sub = pickClass(im[1], 'sub');
        if (!h) continue;
        const { time, title: t } = splitTime(h);
        stops.push({ time, title: t, sub: sub || undefined });
      }
      if (stops.length) itinerary = stops;
      continue;
    }

    // regular section: collect .cubiculo items
    const items: string[] = [];
    const cubRe = /<div class="cubiculo">([\s\S]*?)<\/div>/gi;
    let cub: RegExpExecArray | null;
    while ((cub = cubRe.exec(body))) {
      const t = strip(cub[1]);
      if (t.length > 1) items.push(t);
    }
    if (items.length && title) sections.push({ title, items });
  }

  return { hasStructure: true, intro, chips, sections, itinerary };
}
