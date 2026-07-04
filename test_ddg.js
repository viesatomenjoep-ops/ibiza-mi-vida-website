const https = require('https');
async function searchDDG(query) {
  return new Promise((resolve) => {
    https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/https:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9]+/);
        resolve(match ? match[0] : null);
      });
    });
  });
}
searchDDG('site:open.spotify.com/artist "John Summit"').then(console.log);
