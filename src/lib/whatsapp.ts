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
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34XXXXXXXXX'

  const event = params.clubName
    ? `${params.clubName} — ${params.serviceName}`
    : params.serviceName

  const date = params.date ?? 'TBD'

  const text = `my name is ${params.firstName} ${params.lastName} and i am interested in ${event} on date ${date}`

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
