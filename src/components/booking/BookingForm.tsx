'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitBookingLead } from '@/app/actions/booking'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { BookingConfig, BookingFormValues } from '@/types/booking'

interface BookingFormProps {
  config: BookingConfig
  onSuccess: (firstName: string) => void
}

export function BookingForm({ config, onSuccess }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<BookingFormValues>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const validate = (): boolean => {
    const next: Partial<BookingFormValues> = {}
    if (!values.firstName.trim()) next.firstName = 'First name is required'
    if (!values.lastName.trim()) next.lastName = 'Last name is required'
    if (!values.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Please enter a valid email address'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError(null)

    const { error } = await submitBookingLead({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      message: values.message || null,
      service_type: config.serviceType,
      service_name: config.serviceName,
      arrival_date: config.arrivalDate ?? null,
      source_page: config.sourcePage ?? null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    })

    if (error) {
      setServerError(error)
      setLoading(false)
      return
    }

    const whatsAppUrl = buildWhatsAppUrl({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      serviceName: config.serviceName,
      clubName: config.clubName,
      date: config.arrivalDate,
      message: values.message || undefined,
    })

    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')
    onSuccess(values.firstName)
    setLoading(false)
  }

  const field = (
    id: keyof BookingFormValues,
    label: string,
    type = 'text',
    required = true
  ) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-xs font-semibold uppercase tracking-wider text-velvet-obsidian/60">
        {label}{required && <span className="ml-0.5 text-rustic-terracotta">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={values[id]}
        onChange={(e) => setValues((v) => ({ ...v, [id]: e.target.value }))}
        required={required}
        className={[
          'rounded-xl border bg-transparent px-4 py-3 font-sans text-sm text-velvet-obsidian placeholder-velvet-obsidian/30',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-rustic-terracotta focus:ring-offset-0',
          errors[id] ? 'border-red-400' : 'border-velvet-obsidian/20 focus:border-rustic-terracotta',
        ].join(' ')}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        aria-invalid={!!errors[id]}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="font-sans text-xs text-red-500" role="alert">
          {errors[id]}
        </p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Booking enquiry form">
      <div className="grid grid-cols-2 gap-4">
        <div>{field('firstName', 'First Name')}</div>
        <div>{field('lastName', 'Last Name')}</div>
      </div>

      <div className="mt-4">{field('email', 'Email Address', 'email')}</div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="message" className="font-sans text-xs font-semibold uppercase tracking-wider text-velvet-obsidian/60">
          Message <span className="text-velvet-obsidian/30 normal-case">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          placeholder="Any special requests or questions?"
          className="resize-none rounded-xl border border-velvet-obsidian/20 bg-transparent px-4 py-3 font-sans text-sm text-velvet-obsidian placeholder-velvet-obsidian/30 transition-colors focus:border-rustic-terracotta focus:outline-none focus:ring-2 focus:ring-rustic-terracotta"
        />
      </div>

      {serverError && (
        <p className="mt-3 font-sans text-xs text-red-500" role="alert">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        variant="rustic-terracotta"
        size="lg"
        fullWidth
        disabled={loading}
        showArrow={!loading}
        className="mt-6"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          'Continue to WhatsApp'
        )}
      </Button>

      <p className="mt-3 text-center font-sans text-xs text-velvet-obsidian/40">
        We&apos;ll save your details and open WhatsApp for a direct reply.
      </p>
    </form>
  )
}
