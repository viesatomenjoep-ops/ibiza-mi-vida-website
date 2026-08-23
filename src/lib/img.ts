// Next's /_next/image route 400s on any `w` that isn't one of its configured
// imageSizes/deviceSizes (defaults below — this project doesn't override them
// in next.config.mjs). Snap any requested width up to the nearest allowed value.
const NEXT_IMAGE_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
const snapWidth = (w: number) => NEXT_IMAGE_WIDTHS.find((v) => v >= w) ?? NEXT_IMAGE_WIDTHS[NEXT_IMAGE_WIDTHS.length - 1]

/**
 * Route a raw <img src> through Next's built-in image optimizer (`/_next/image`)
 * without needing the `<Image>` component — useful for existing markup that
 * already has hand-tuned layout/CSS and just needs the network payload cut.
 *
 * Some source images (e.g. media.clubtickets.com event covers) ship at
 * 1-1.5MB raw; requesting a width-capped, auto-format derivative here routes
 * them through Vercel's image CDN (resize + AVIF/WebP + compression), the
 * same pipeline `next/image` already uses elsewhere on the site.
 * Local/relative paths and empty values are returned untouched.
 */
export function optImg(src: string | undefined | null, width: number, quality = 75): string {
  if (!src || !/^https?:\/\//.test(src)) return src || ''
  // Next's optimizer 400s on SVG sources by default (security: SVGs can embed
  // script). Vector graphics don't benefit from raster resizing anyway — serve
  // them straight from source instead of proxying.
  if (/\.svg(\?|$)/i.test(src)) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=${snapWidth(width)}&q=${quality}`
}
