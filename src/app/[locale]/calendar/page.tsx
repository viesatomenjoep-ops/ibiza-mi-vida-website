import { getDictionary } from '@/lib/dictionary';
import CalendarClient from './CalendarClient';
import { supabase } from '@/lib/supabase/client';

export default async function CalendarPage({ 
  params,
  searchParams
}: { 
  params: { locale: string },
  searchParams: { month?: string }
}) {
  const dict = await getDictionary(params.locale as any);
  
  // Default to current month if no month is provided
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  const targetMonthStr = searchParams.month || currentMonth;
  const targetDate = new Date(`${targetMonthStr}-01T00:00:00Z`);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const startOfMonthStr = `${year}-${month.toString().padStart(2, '0')}-01`;
  
  // Calculate end of month
  const endDate = new Date(year, month, 0);
  const endOfMonthStr = `${year}-${month.toString().padStart(2, '0')}-${endDate.getDate()}`;

  // Fetch dates for this month
  const { data: events } = await supabase
    .from('ct_dates')
    .select('*, ct_events(name, slug, logo, cover), ct_venues(name, slug, whitelogo, is_day_club, type_slug)')
    .gte('date', startOfMonthStr)
    .lte('date', endOfMonthStr)
    .order('date', { ascending: true });

  return (
    <CalendarClient 
      events={events || []} 
      dict={dict} 
      locale={params.locale}
      initialMonth={targetMonthStr}
    />
  );
}
