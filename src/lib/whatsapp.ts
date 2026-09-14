/**
 * The business WhatsApp number (Simon). One constant, read by every surface.
 *
 * This used to fall back to a literal behind NEXT_PUBLIC_WHATSAPP_NUMBER, and
 * that split cost us a number change: the env var in Vercel kept its old value
 * while the code carried the new one, so the site served BOTH — the visible
 * text and some links updated, while the schema.org telephone and the rest of
 * the wa.me links stayed on the old number. Nothing errored; there was no way
 * to see it except by reading the rendered HTML.
 *
 * The number is not a secret — it is printed on every page — and it changes
 * roughly never. So there is nothing an environment variable buys here, and
 * one source of truth is worth more than the configurability. A NEXT_PUBLIC_
 * variable is also baked in at BUILD time, which is why changing it in Vercel
 * does nothing until the next deploy: another way for the two to drift apart.
 */
export const WHATSAPP_NUMBER = '34657639800'

interface WhatsAppParams {
  firstName: string
  lastName: string
  email: string
  serviceName: string
  date?: string
  message?: string
  clubName?: string
}

export function buildWhatsAppUrl(params: WhatsAppParams): string {
  const phone = WHATSAPP_NUMBER

  const event = params.clubName
    ? `${params.clubName} — ${params.serviceName}`
    : params.serviceName

  const date = params.date ?? 'TBD'

  const text = `my name is ${params.firstName} ${params.lastName} and i am interested in ${event} on date ${date}`

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
