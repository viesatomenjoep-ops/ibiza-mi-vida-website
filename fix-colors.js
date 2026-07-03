const fs = require('fs');
let content = fs.readFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/deals-of-the-day/DealsOfTheDayClient.tsx', 'utf8');

// Replace text-white with text-black
content = content.replace(/text-white/g, 'text-black');
content = content.replace(/text-white\/60/g, 'text-black/60');
content = content.replace(/text-white\/40/g, 'text-black/40');
content = content.replace(/text-white\/50/g, 'text-black/50');
content = content.replace(/text-white\/10/g, 'text-black/10');
content = content.replace(/text-white\/5/g, 'text-black/5');
content = content.replace(/border-white\/10/g, 'border-black/10');
content = content.replace(/bg-white\/5/g, 'bg-black/5');

fs.writeFileSync('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]/deals-of-the-day/DealsOfTheDayClient.tsx', content);
console.log('Colors fixed');
