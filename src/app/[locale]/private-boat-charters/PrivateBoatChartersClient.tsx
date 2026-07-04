'use client';

import React from 'react';
import FleetShowcase from '@/components/boats/FleetShowcase';

export default function PrivateBoatChartersClient({ locale = 'nl' }: { locale: string }) {
  return <FleetShowcase locale={locale} />;
}
