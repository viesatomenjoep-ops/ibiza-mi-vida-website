'use client';

import React from 'react';
import FleetShowcase from '@/components/boats/FleetShowcase';
import type { LiveFleet } from '@/lib/yacht-broker';

export default function PrivateBoatChartersClient({ locale = 'nl', live = null, today = null }: {
  locale: string;
  live?: LiveFleet | null;
  today?: string | null;
}) {
  return <FleetShowcase locale={locale} initialLive={live} initialDate={today} />;
}
