export function stripHtml(html: string | undefined): string {
  if (!html) return '';
  let str = html;
  
  // Remove style and script blocks and their content completely
  str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Strip all remaining HTML tags rigorously
  str = str.replace(/<\/?[^>]+(>|$)/g, ' ');
  
  // Clean up whitespace and duplicate dashes
  str = str.replace(/\s*-\s*(-\s*)+/g, ' - ');
  str = str.replace(/\s\s+/g, ' ');
  str = str.replace(/^-|-$/g, '').trim();
  
  // Handle HTML entities
  str = str.replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&#39;/g, "'")
           .replace(/&nbsp;/g, ' ');
           
  return str;
}

export function cleanHtml(html: string | undefined | null): string {
  if (!html) return '';
  let str = html;
  
  // 1. Remove promo garbage and standard script/style tags
  str = str.split('.promo-hz')[0];
  str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // 2. Aggressively remove inline JS function block
  str = str.replace(/\(function\(\)\{[\s\S]*?\}\)\(\);/gi, '');
  
  // 3. Remove known CSS blocks that use malformed style tags
  str = str.replace(/x:root\s*\{[^}]*?\}/gi, '');
  
  // Generic CSS class block remover: matches `.classname { ... }` or `.class1, .class2 { ... }`
  str = str.replace(/\.[a-zA-Z0-9_\-\s\.\,\:]+\{[^}]*?\}/gi, '');

  // 4. Remove raw pseudo-CSS and JS using line-by-line heuristics
  const lines = str.split('\n');
  const cleanedLines = lines.filter(line => {
    const l = line.replace(/<br \/>/g, '').trim();
    if (!l) return true;
    
    // CSS blocks (anything that looks like a CSS selector ending in { or })
    if (l.includes('{') && l.includes('}')) {
      if (l.match(/^[\.#a-zA-Z0-9_\-:\s,\[\]\>\*]+\s*\{/)) return false;
    }
    if (l.endsWith('{') && l.match(/^[\.#a-zA-Z0-9_\-:\s,\[\]\>\*]+$/)) return false;
    if (l === '}' || l === '};') return false;
    if (l.startsWith('--')) return false;
    if (l.match(/^[a-zA-Z\-]+:\s*[^;]+;/)) return false;
    if (l.startsWith('/*') && l.endsWith('*/')) return false;
    if (l.startsWith('@media') || l.startsWith('@keyframes')) return false;
    if (l.match(/^[0-9]+%\s*\{/)) return false;
    if (l.includes('from{') || l.includes('to{')) return false;
    if (l.startsWith(':root')) return false;
    
    // Hardcoded aggressive CSS stripping
    if (
      l.includes('details[open]') || 
      l.includes('.detalles') || 
      l.includes('.itinerary-block') || 
      l.includes('.pill::after') ||
      l.includes('.pill{') ||
      l.includes('.included-row') ||
      l.includes('.chip{') ||
      l.includes('.icon{') ||
      l.includes('.icon ') ||
      l.includes('.trip-ticket') ||
      l.includes('box-sizing:border-box') ||
      l.includes('content:"–"') ||
      l.includes('!important') ||
      l.includes('-webkit-') ||
      l.includes('outline:none') ||
      (l.startsWith('.') && (l.endsWith(',') || l.includes('{'))) ||
      l.match(/^\.[a-zA-Z0-9_\-]+(\s*\{)?$/) // Matches single classes like .cubiculo{
    ) {
      return false;
    }
    
    // JS lines
    if (
      l.includes('function recalc()') || 
      l.includes('document.getElementById') || 
      l.includes('document.querySelectorAll') ||
      l.includes('window.addEventListener') ||
      l.includes('MutationObserver') ||
      l.includes('setTimeout') ||
      l.includes('getBoundingClientRect') ||
      l.includes('style.height') ||
      l.includes('style.top') ||
      l.includes('icons.length') ||
      l.includes('list.querySelectorAll') ||
      l.includes('return;') ||
      l.includes('const y1 =') ||
      l.includes('const y2 =') ||
      l.includes('line.style.')
    ) {
      return false;
    }
    return true;
  });
  
  str = cleanedLines.join('\n');
  
  // Clean up loose closing braces left from multi-line CSS
  str = str.replace(/^\s*}\s*<br \/>\s*$/gm, '');
  str = str.replace(/^\s*}\s*$/gm, '');
  
  // Clean empty <br /> chains left behind
  str = str.replace(/(?:<br \/>\s*){3,}/g, '<br /><br />');
  
  return str.trim();
}
