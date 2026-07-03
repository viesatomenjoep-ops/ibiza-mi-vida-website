const fs = require('fs');
let content = fs.readFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/artists/page.tsx', 'utf8');

if (!content.includes('EventsBackground')) {
  content = content.replace(/import Link from 'next\/link'/, "import Link from 'next/link'\nimport { EventsBackground } from '@/components/layout/EventsBackground'");
}

content = content.replace(/<main className="theme-monaco-vip bg-\[var\(--color-paper\)\] min-h-screen text-\[var\(--color-ink\)\] pt-\[16px\] pb-24">/, '<main className="theme-monaco-vip bg-transparent min-h-screen text-[var(--color-ink)] pt-[16px] pb-24 relative overflow-hidden">\n      <EventsBackground />');

fs.writeFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/artists/page.tsx', content);
console.log('Artists updated');
