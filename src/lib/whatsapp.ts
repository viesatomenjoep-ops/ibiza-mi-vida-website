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

  const lines = [
    `Hi Ibiza mi vida! I'm ${params.firstName} ${params.lastName} and I'd like to enquire about:`,
    ``,
    `Service: ${params.clubName ? `${params.clubName} — ` : ''}${params.serviceName}`,
    params.date ? `Date: ${params.date}` : null,
    params.message ? `Message: ${params.message}` : null,
    ``,
    `My email: ${params.email}`,
  ]
    .filter((l) => l !== null)
    .join('\n')

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines)}`
}
