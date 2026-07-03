const fs = require('fs');
let content = fs.readFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/club-tickets/ClubTicketsClient.tsx', 'utf8');

if (!content.includes('EventsBackground')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { EventsBackground } from '@/components/layout/EventsBackground';");
}

// Replace the `<>` wrapper with a transparent div that includes EventsBackground
content = content.replace(/return \(\s*<>\s*<section className="pt-0 pb-4">/, 'return (\n    <div className="theme-monaco-vip bg-transparent text-[var(--color-ink)] min-h-screen relative overflow-hidden">\n      <EventsBackground />\n      <section className="pt-0 pb-4 relative z-10">');

// Close the div instead of </>
content = content.replace(/<\/section>\s*<\/>/, '</section>\n    </div>');
content = content.replace(/text-white/g, 'text-black'); // Adjust text color for white background
content = content.replace(/text-white\/60/g, 'text-black/60');
content = content.replace(/text-white\/5/g, 'text-black/5');

fs.writeFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/club-tickets/ClubTicketsClient.tsx', content);
console.log('ClubTickets updated');
