#!/usr/bin/env node
/**
 * One-time migration: upload every hero/background clip into OUR Cloudinary
 * cloud (nd941t40) under stable public ids that the app references.
 *
 * Run it once with your Cloudinary credentials in the environment:
 *
 *   CLOUDINARY_URL="cloudinary://<API_KEY>:<API_SECRET>@nd941t40" \
 *     node scripts/upload-to-cloudinary.mjs
 *
 *   # or, instead of CLOUDINARY_URL:
 *   CLOUDINARY_CLOUD_NAME=nd941t40 \
 *   CLOUDINARY_API_KEY=xxxx \
 *   CLOUDINARY_API_SECRET=xxxx \
 *     node scripts/upload-to-cloudinary.mjs
 *
 * Safe to re-run — every asset is uploaded with overwrite:true.
 */

import { v2 as cloudinary } from 'cloudinary'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Configure from CLOUDINARY_URL, or explicit vars, and force our cloud.
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true })
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'nd941t40',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

const cfg = cloudinary.config()
if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
  console.error(
    '\n✗ Missing Cloudinary credentials.\n' +
      '  Set CLOUDINARY_URL (cloudinary://KEY:SECRET@nd941t40)\n' +
      '  or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.\n',
  )
  process.exit(1)
}
console.log(`→ Uploading to Cloudinary cloud: ${cfg.cloud_name}\n`)

/**
 * Assets to migrate. `source` is either a local file (relative to repo root) or
 * a remote URL (the current asset on the old cloud). `publicId` MUST match the
 * ids in src/lib/cloudinary.ts (the MEDIA map).
 */
const ASSETS = [
  {
    publicId: 'ibiza-mi-vida/events-background',
    source:
      'https://res.cloudinary.com/daj1lyfgk/video/upload/v1783098563/zna3zmwypuqpikuatbqy.mp4',
  },
  {
    publicId: 'ibiza-mi-vida/formentera-4k',
    source:
      'https://res.cloudinary.com/daj1lyfgk/video/upload/v1781127267/YTDown_YouTube_Formentera-Spain-4K-Drone_Media_1Y8xgVJwzk0_001_1080p_bqyeg4.mp4',
  },
  { publicId: 'ibiza-mi-vida/home/anyma-1', source: 'public/videos/anyma-1.mp4' },
  { publicId: 'ibiza-mi-vida/home/anyma-2', source: 'public/videos/anyma-2.mp4' },
  { publicId: 'ibiza-mi-vida/home/calvin', source: 'public/videos/calvin.mp4' },
]

async function uploadOne({ publicId, source }) {
  const isRemote = /^https?:\/\//.test(source)
  const localPath = isRemote ? null : path.join(ROOT, source)

  if (localPath && !fs.existsSync(localPath)) {
    console.warn(`  ⚠ skip ${publicId} — local file not found: ${source}`)
    return null
  }

  const target = localPath ?? source
  const opts = {
    public_id: publicId,
    resource_type: 'video',
    overwrite: true,
    invalidate: true,
    timeout: 600000,
  }

  // Remote URLs are fetched server-side by Cloudinary. Local files up to ~100MB
  // upload fine via the regular (promise-based) uploader; only truly huge files
  // need the chunked upload_large path.
  const isHuge = localPath && fs.statSync(localPath).size > 95 * 1024 * 1024
  const result = isHuge
    ? await cloudinary.uploader.upload_large(target, { ...opts, chunk_size: 20 * 1024 * 1024 })
    : await cloudinary.uploader.upload(target, opts)
  console.log(`  ✓ ${publicId}  (${result.width}x${result.height}, ${(result.bytes / 1e6).toFixed(1)}MB)`)
  return result
}

let failed = 0
for (const asset of ASSETS) {
  try {
    await uploadOne(asset)
  } catch (err) {
    failed++
    console.error(`  ✗ ${asset.publicId} — ${err?.message || err}`)
  }
}

console.log(
  failed
    ? `\nDone with ${failed} failure(s). Fix and re-run.`
    : '\n✓ All assets uploaded to nd941t40. Redeploy on Vercel to use them.',
)
process.exit(failed ? 1 : 0)
