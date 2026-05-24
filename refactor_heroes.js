const fs = require('fs');
const path = require('path');

const files = [
  'deals-of-the-day/page.tsx',
  'club-tickets/page.tsx',
  'boat-parties/page.tsx',
  'private-boat-charters/page.tsx',
  'vip-catamaran/page.tsx',
  'formentera-boat-trips/page.tsx',
  'drink-packages/page.tsx',
  'car-scooter-rental/page.tsx',
  'free-discount-ibiza/page.tsx',
  'guestlist/page.tsx',
  'tips/page.tsx',
  'blog/page.tsx'
];

const themes = ['teal', 'gold', 'rose', 'indigo', 'midnight'];

files.forEach((file, index) => {
  const filePath = path.join('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace import
  content = content.replace(/import \{ Hero \} from '@\/components\/hero\/Hero'/g, "import { CategoryHero } from '@/components/hero/CategoryHero'");
  
  // Replace Hero tag and remove backgroundImage
  const theme = themes[index % themes.length];
  content = content.replace(/<Hero\s+title=\{([^}]+)\}\s+subtitle=\{([^}]+)\}\s+backgroundImage=\{([^}]+)\}/g, `<CategoryHero\n        title={$1}\n        subtitle={$2}\n        colorTheme="${theme}"`);
  
  content = content.replace(/<Hero\s+title="([^"]+)"\s+subtitle="([^"]+)"\s+backgroundImage="([^"]+)"/g, `<CategoryHero\n        title="$1"\n        subtitle="$2"\n        colorTheme="${theme}"`);

  // Handle fallback experiences which use spread props or other things
  // Specifically club-tickets has:
  /*
      <Hero
        title="Club Tickets"
        subtitle="Secure your entry to the best clubs in Ibiza. Official tickets, instant confirmation."
        backgroundImage="/fotos/club_tickets_hero.png"
        eyebrow="Official Tickets"
        minHeight="min-h-[50vh]"
      />
  */
  // A more robust replacement for <Hero
  content = content.replace(/<Hero\s+/g, '<CategoryHero ');
  // Remove backgroundImage line
  content = content.replace(/\s+backgroundImage=[^\n]+/g, '');

  // Ensure colorTheme is added before the closing tag if it's not there
  // Actually, wait, replacing the string above works for most. 
  // Let's just do it with a simple regex for backgroundImage
  
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Refactored heroes');
