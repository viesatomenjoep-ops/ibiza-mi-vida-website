import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

/**
 * On-demand cache-invalidatie vanaf het partnerplatform.
 *
 * Wanneer een partner in partners.ibizamivida.com een voertuig publiceert of een
 * zoneprijs aanpast, stuurt api.ibizamivida.com hier de cache-tags heen die
 * daardoor verouderd zijn. De eerstvolgende bezoeker krijgt dan de nieuwe data
 * in plaats van te wachten tot de ISR-termijn verloopt.
 *
 * ── Waarom de handtekening over de RAUWE body gaat ────────────────────────
 * De HMAC wordt berekend over precies de bytes die binnenkomen. `req.json()`
 * en daarna opnieuw serialiseren levert andere bytes op (sleutelvolgorde,
 * spaties, unicode-escapes) en dan klopt de handtekening nooit meer. Dus eerst
 * `req.text()`, dan verifiëren, en pas daarna parsen.
 *
 * ── Waarom timingSafeEqual met een lengtecheck ervoor ─────────────────────
 * timingSafeEqual gooit een exception als de buffers verschillen in lengte. Wie
 * die check overslaat, verandert een geknoeide header in een 500 in plaats van
 * een 401 — en een 500 is een ander antwoord dan een 401, dus dat lekt precies
 * de informatie die constante-tijdvergelijking moet verbergen.
 *
 * Zonder IMV_WEBHOOK_SECRET is dit endpoint uitgeschakeld en antwoordt het 503.
 * Dat is bewust: een revalidate-endpoint zonder verificatie is een knop waarmee
 * een willekeurige bezoeker de cache van de hele site kan legen.
 */

export const dynamic = 'force-dynamic'

/** Tags die het platform mag verversen. Alles daarbuiten wordt genegeerd. */
const ALLOWED = /^(vehicles|zones|vehicle_[a-z0-9-]+|org_[a-z0-9-]+)$/i

export async function POST(req: Request) {
  const secret = process.env.IMV_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'revalidate is not configured' },
      { status: 503 },
    )
  }

  const raw = await req.text()
  const signature = req.headers.get('x-imv-signature') ?? ''
  const expected = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex')

  const given = Buffer.from(signature, 'utf8')
  const want = Buffer.from(expected, 'utf8')
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let tags: unknown
  try {
    tags = (JSON.parse(raw) as { tags?: unknown }).tags
  } catch {
    return NextResponse.json({ error: 'body is not json' }, { status: 400 })
  }

  if (!Array.isArray(tags) || tags.some(t => typeof t !== 'string')) {
    return NextResponse.json({ error: 'tags must be an array of strings' }, { status: 400 })
  }

  // Een onbekende tag is geen fout maar wordt ook niet doorgegeven: revalidateTag
  // met een verzonnen naam is een no-op, en het stil accepteren maakt een typfout
  // in het platform onzichtbaar. Daarom komt de lijst terug in het antwoord.
  const accepted = (tags as string[]).filter(t => ALLOWED.test(t))
  const ignored = (tags as string[]).filter(t => !ALLOWED.test(t))

  for (const tag of accepted) revalidateTag(tag)

  return NextResponse.json({ revalidated: true, accepted, ignored })
}
