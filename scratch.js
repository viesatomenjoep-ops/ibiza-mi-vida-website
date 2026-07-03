const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('Client.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove <nav className="pl-quick-nav-inner"...</nav>
      content = content.replace(/<nav\s+className="pl-quick-nav-inner"[\s\S]*?<\/nav>/g, '');
      
      // Remove crumb divs
      content = content.replace(/<div\s+className="crumb[^"]*"[\s\S]*?<\/div>/g, '');
      
      // Remove pl-eyebrow spans
      content = content.replace(/<span\s+className="pl-eyebrow"[^>]*>.*?<\/span>/g, '');

      // Remove the calendar eyebrow spans (text-[0.78rem])
      content = content.replace(/<span\s+className="text-\[0\.78rem\][^>]*>.*?<\/span>/g, '');
      
      // Remove padding / margins
      content = content.replace(/<div\s+style=\{\{width:'100%',\s*marginTop:\s*'16px'\}\}>/g, '<div style={{width:"100%"}}>');
      content = content.replace(/<div\s+className="mb-8 flex flex-col gap-2">/g, '<div className="flex flex-col gap-2">');
      content = content.replace(/<section\s+className="pt-8\s+pb-4">/g, '<section className="pt-0 pb-4">');

      fs.writeFileSync(fullPath, content);
      console.log('Processed', fullPath);
    }
  }
}
processDir('/Users/tomvanbiene/Desktop/ibiza-mi-vida-website/src/app/[locale]');
