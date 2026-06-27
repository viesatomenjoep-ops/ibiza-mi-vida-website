const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/clubtickets_nl.json', 'utf8'));

let countCSS = 0;
let countJS = 0;

data.events.forEach(e => {
  if (e.description && e.description.includes(':root{')) {
    countCSS++;
    console.log(`Found CSS in event: ${e.name}`);
  }
  if (e.description && e.description.includes('(function(){')) {
    countJS++;
  }
});

console.log(`Events with CSS: ${countCSS}`);
console.log(`Events with JS: ${countJS}`);
