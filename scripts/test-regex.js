const fs = require('fs');

function deepCleanHtml(html) {
  if (!html) return '';
  let str = html.split('.promo-hz')[0];
  str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  let prev;
  do {
    prev = str;
    str = str.replace(/(?:^|<br \/>|\r|\n|\s|>)(?:[\.#a-zA-Z0-9_\-:\s,\[\]\>\*]+)\s*\{[^{}]*\}/g, ' ');
  } while (str !== prev);
  
  const lines = str.split('\n');
  const cleanedLines = lines.filter(line => {
    let l = line.replace(/<br \/>/g, '').trim();
    if (!l) return true;
    
    // Drop lines that are clearly CSS selectors/rules
    if (l.match(/^[\.#a-zA-Z0-9_\-:\s,\[\]\>\*]+(?:,|{)$/)) return false;
    
    // Drop lines containing specific injected CSS/JS keywords
    if (
      l.includes('details[open]') || 
      l.includes('.detalles') || 
      l.includes('.itinerary-block') || 
      l.includes('.pill::after') ||
      l.includes('.pill{') ||
      l.includes(':root{') ||
      l.includes(':root {') ||
      l.includes('.included-row{') ||
      l.includes('.chip{') ||
      l.includes('.icon{') ||
      l.startsWith('--') ||
      l.includes('box-sizing:border-box') ||
      l.includes('content:"–"')
    ) {
      return false;
    }
    
    // Drop known JS lines
    if (
      l.includes('(function(){') || 
      l.includes('function recalc(){') || 
      l.includes('const list = document.getElementById') || 
      l.includes('const line = document.getElementById') ||
      l.includes('if(!list || !line) return;') ||
      l.includes('const icons = list.querySelectorAll') ||
      l.includes('if(icons.length') ||
      l.includes('const first = icons') ||
      l.includes('const last = icons') ||
      l.includes('const box = list') ||
      l.includes('const y1 =') ||
      l.includes('const y2 =') ||
      l.includes('line.style.') || 
      l.includes('window.addEventListener') || 
      l.includes('document.querySelectorAll') ||
      l.includes('const listEl =') ||
      l.includes('if(listEl) new MutationObserver') ||
      l.includes('})();') ||
      l.includes('d.addEventListener')
    ) {
      return false;
    }
    
    return true;
  });
  
  str = cleanedLines.join('\n');
  
  str = str.replace(/(?:<br \/>\s*){3,}/g, '<br /><br />');
  str = str.replace(/^(?:<br \/>\s*)+/, '');
  
  return str.trim();
}

const data = JSON.parse(fs.readFileSync('src/data/clubtickets_nl.json', 'utf8'));
const e = data.events.find(e => e.slug === 'aftersun');
if (e) {
  console.log("--- CLEANED AFTER SUN ---");
  console.log(deepCleanHtml(e.description));
}
