export type BookingStatus = 'new' | 'contacted' | 'booked' | 'lost'

export interface BookingLead {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  service_type: string
  service_name: string | null
  arrival_date: string | null
  message: string | null
  source_page: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  status: BookingStatus
}

export type BookingLeadInsert = Omit<BookingLead, 'id' | 'created_at' | 'status'>

export interface BookingFormValues {
  firstName: string
  lastName: string
  email: string
  message: string
}

export interface BookingConfig {
  serviceType: string
  serviceName: string
  clubName?: string
  arrivalDate?: string
  sourcePage?: string
}
