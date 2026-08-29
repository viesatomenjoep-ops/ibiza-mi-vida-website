/**
 * The business WhatsApp number (Simon). The literal is the fallback so links
 * keep working even when NEXT_PUBLIC_WHATSAPP_NUMBER is not set in the
 * environment — every surface on the site must reach the same number.
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '33666528412'

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
