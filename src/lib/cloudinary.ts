/**
 * Cloudinary media helpers.
 *
 * Goal: deliver every hero/background clip (including the 4K drone footage)
 * and every image straight from Cloudinary so they load as fast as possible.
 *
 * How "instant" 4K works here:
 *  - `q_auto,f_auto` lets Cloudinary pick the smallest modern codec/quality the
 *    visitor's browser supports (AV1/H.265/VP9 → far smaller than a raw .mp4),
 *    so the clip starts streaming almost immediately.
 *  - A poster image is generated from the video's first frame so the hero paints
 *    instantly while the video buffers behind it (no black flash).
 *  - Video is streamed progressively (`fl_progressive`) so playback can start
 *    before the whole file is downloaded.
 */

/** The Cloudinary cloud that hosts our media (overridable via env). */
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  'nd941t40'

/**
 * Public ids of the hero/background clips on our own Cloudinary cloud.
 * These are populated by `scripts/upload-to-cloudinary.mjs` (run once with the
 * Cloudinary API key) and referenced from the video components below.
 */
export const MEDIA = {
  eventsBackground: 'ibiza-mi-vida/events-background',
  formentera4k: 'ibiza-mi-vida/formentera-4k',
  homeHero: [
    'ibiza-mi-vida/home/anyma-1',
    'ibiza-mi-vida/home/anyma-2',
    'ibiza-mi-vida/home/calvin',
  ],
} as const

const VIDEO_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload`
const IMAGE_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`

/** Default transformation chain applied to background/hero videos. */
const DEFAULT_VIDEO_TRANSFORM = 'q_auto,f_auto,fl_progressive'

type CloudinaryUrlParts = {
  /** The cloud that hosts this URL (kept as-is so we never rewrite it). */
  cloud: string
  /** Everything after `/upload/` up to (but not including) the public id + version. */
  transform: string
  /** The version + public id + extension, e.g. `v123/foo.mp4`. */
  publicPart: string
}

const CLOUDINARY_UPLOAD_RE =
  /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(?:image|video)\/upload\/(.*)$/

/** Parse an existing Cloudinary delivery URL into its transform + public parts. */
function parseCloudinaryUrl(url: string): CloudinaryUrlParts | null {
  const match = url.match(CLOUDINARY_UPLOAD_RE)
  if (!match) return null

  const cloud = match[1]
  const rest = match[2]
  const segments = rest.split('/')

  // Transformation segments live before the version (`v123…`) or the public id.
  // A transformation segment contains an `_` param (e.g. `q_auto`) or a `,`.
  const transformSegments: string[] = []
  let i = 0
  for (; i < segments.length; i++) {
    const seg = segments[i]
    const looksLikeTransform =
      /(^|,)[a-z]{1,3}_/.test(seg) && !/^v\d+$/.test(seg)
    if (looksLikeTransform) transformSegments.push(seg)
    else break
  }

  return {
    cloud,
    transform: transformSegments.join('/'),
    publicPart: segments.slice(i).join('/'),
  }
}

/**
 * Ensure a Cloudinary video URL is delivered with instant-load transformations.
 * Adds `q_auto,f_auto,fl_progressive` (merging with any existing transforms such
 * as `so_30,du_30`). Non-Cloudinary URLs are returned untouched.
 */
export function optimizeCloudinaryVideo(url: string): string {
  const parts = parseCloudinaryUrl(url)
  if (!parts) return url

  const existing = parts.transform ? parts.transform.split('/') : []
  const flat = existing.join(',')

  const additions: string[] = []
  if (!/\bq_/.test(flat)) additions.push('q_auto')
  if (!/\bf_/.test(flat)) additions.push('f_auto')
  if (!/\bfl_progressive\b/.test(flat)) additions.push('fl_progressive')

  const transform = additions.length
    ? [...existing, additions.join(',')].filter(Boolean).join('/')
    : existing.join('/')

  // Keep the URL's own cloud so existing assets are never rewritten to a
  // different (possibly empty) cloud when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME changes.
  const base = `https://res.cloudinary.com/${parts.cloud}/video/upload`
  return `${base}/${transform ? transform + '/' : ''}${parts.publicPart}`
}

/**
 * Build a poster (first-frame) image URL for a Cloudinary video so the hero can
 * paint immediately while the clip buffers. Preserves seek/crop transforms
 * (e.g. `so_30`) so the poster matches the first visible frame.
 */
export function cloudinaryVideoPoster(url: string): string | undefined {
  const parts = parseCloudinaryUrl(url)
  if (!parts) return undefined

  // Reuse start-offset if present so the poster is the actual first shown frame.
  const startOffset = parts.transform.match(/(?:^|[,/])so_([\d.]+)/)?.[1]
  const poster = ['q_auto', 'f_auto', `so_${startOffset ?? '0'}`].join(',')

  const publicNoExt = parts.publicPart.replace(/\.[a-z0-9]+$/i, '')
  const base = `https://res.cloudinary.com/${parts.cloud}/video/upload`
  return `${base}/${poster}/${publicNoExt}.jpg`
}

type VideoOptions = {
  /** Extra Cloudinary transforms, e.g. `so_30,du_30` for a 30s slice. */
  transform?: string
  /** Cap the delivered width in px (omit for source resolution, e.g. 4K). */
  width?: number
}

/**
 * Build an optimized Cloudinary video URL from a bare public id
 * (e.g. `v1783098563/zna3zmwypuqpikuatbqy` or `folder/clip`).
 */
export function cloudinaryVideo(publicId: string, opts: VideoOptions = {}): string {
  const chain = [DEFAULT_VIDEO_TRANSFORM]
  if (opts.width) chain.push(`w_${opts.width},c_limit`)
  if (opts.transform) chain.push(opts.transform)
  const publicNoExt = publicId.replace(/^\/+/, '').replace(/\.[a-z0-9]+$/i, '')
  return `${VIDEO_BASE}/${chain.join('/')}/${publicNoExt}.mp4`
}

type ImageOptions = {
  width?: number
  height?: number
  /** Cloudinary crop mode, defaults to `fill`. */
  crop?: string
}

/** Build an optimized Cloudinary image URL from a bare public id. */
export function cloudinaryImage(publicId: string, opts: ImageOptions = {}): string {
  const chain = ['q_auto', 'f_auto']
  if (opts.width) chain.push(`w_${opts.width}`)
  if (opts.height) chain.push(`h_${opts.height}`)
  if (opts.width || opts.height) chain.push(`c_${opts.crop || 'fill'}`)
  const publicNoExt = publicId.replace(/^\/+/, '').replace(/\.[a-z0-9]+$/i, '')
  return `${IMAGE_BASE}/${chain.join(',')}/${publicNoExt}`
}
