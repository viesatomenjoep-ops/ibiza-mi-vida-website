const fs = require('fs');
let content = fs.readFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/calendar/CalendarClient.tsx', 'utf8');

if (!content.includes('EventsBackground')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { EventsBackground } from '@/components/layout/EventsBackground';");
}

// Ensure the outer shell has transparent background, inject EventsBackground
content = content.replace(/<div className="ck-shell">/, '<div className="ck-shell bg-transparent">\n      <EventsBackground />');

// Change text colors in the header from white to black
content = content.replace(/text-white\/90/g, 'text-black/90');
content = content.replace(/text-white\/50/g, 'text-black/50');
content = content.replace(/text-white\/60/g, 'text-black/60');
content = content.replace(/text-white/g, 'text-black');

fs.writeFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/calendar/CalendarClient.tsx', content);
console.log('Calendar updated');
