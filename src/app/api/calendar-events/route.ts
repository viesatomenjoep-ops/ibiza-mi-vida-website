import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const monthStr = searchParams.get('month'); // format: 'YYYY-MM'

  if (!monthStr) {
    return NextResponse.json({ error: 'Month parameter is required' }, { status: 400 });
  }

  const targetDate = new Date(`${monthStr}-01T00:00:00Z`);
  if (isNaN(targetDate.getTime())) {
    return NextResponse.json({ error: 'Invalid month format' }, { status: 400 });
  }

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const startOfMonthStr = `${year}-${month.toString().padStart(2, '0')}-01`;
  
  const endDate = new Date(year, month, 0);
  const endOfMonthStr = `${year}-${month.toString().padStart(2, '0')}-${endDate.getDate()}`;

  const { data: events, error } = await supabase
    .from('ct_dates')
    .select('*, ct_events(name, slug, logo, cover), ct_venues(name, slug, whitelogo, is_day_club, type_slug)')
    .gte('date', startOfMonthStr)
    .lte('date', endOfMonthStr)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }

  return NextResponse.json({ events: events || [] });
}
