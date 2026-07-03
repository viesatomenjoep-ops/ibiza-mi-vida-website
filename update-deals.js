const fs = require('fs');
let content = fs.readFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/deals-of-the-day/DealsOfTheDayClient.tsx', 'utf8');

// 1. Add import for EventsBackground
if (!content.includes('EventsBackground')) {
  content = content.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { EventsBackground } from '@/components/layout/EventsBackground';");
}

// 2. Remove floating elements logic
content = content.replace(/const \[floatingElements, setFloatingElements\][\s\S]*?setFloatingElements\(elements\);\n\s*\}, \[uniqueClubLogos\]\);/, '');

// 3. Remove inline styles for floatDrift
content = content.replace(/<style dangerouslySetInnerHTML=\{\{ __html: `[\s\S]*?<\/style>/, '');

// 4. Remove floating elements map from JSX
content = content.replace(/\{floatingElements\.map\(\(el\) => \([\s\S]*?\}\)\}/, '');

// 5. Add EventsBackground and make bg transparent
content = content.replace(/<div className="theme-monaco-vip bg-\[var\(--color-paper\)\] text-\[var\(--color-ink\)\] min-h-screen pt-8 pb-24 relative overflow-hidden">/, '<div className="theme-monaco-vip bg-transparent text-[var(--color-ink)] min-h-screen pt-8 pb-24 relative overflow-hidden">\n      <EventsBackground />');

fs.writeFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/deals-of-the-day/DealsOfTheDayClient.tsx', content);
console.log('Deals updated');
