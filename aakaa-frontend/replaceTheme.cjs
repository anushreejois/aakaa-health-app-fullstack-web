const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace direct hex classes
  content = content.replace(/bg-\[\#C83226\]/g, 'bg-aakaa-green');
  content = content.replace(/text-\[\#C83226\]/g, 'text-aakaa-green');
  content = content.replace(/border-\[\#C83226\]/g, 'border-aakaa-green');
  content = content.replace(/ring-\[\#C83226\]/g, 'ring-aakaa-green');
  content = content.replace(/fill=\"\#C83226\"/g, 'fill="#1E4D36"'); // for svg fill
  content = content.replace(/from-\[\#C83226\]/g, 'from-aakaa-green');
  content = content.replace(/via-\[\#C83226\]/g, 'via-aakaa-green');
  content = content.replace(/to-\[\#C83226\]/g, 'to-aakaa-green');
  // the arbitrary alpha ones
  content = content.replace(/bg-\[\#C83226\]\/([0-9]+)/g, 'bg-aakaa-green/$1');
  content = content.replace(/text-\[\#C83226\]\/([0-9]+)/g, 'text-aakaa-green/$1');
  content = content.replace(/border-\[\#C83226\]\/([0-9]+)/g, 'border-aakaa-green/$1');
  content = content.replace(/rgba\(200,50,38,([0-9.]+)\)/g, 'rgba(30,77,54,$1)');

  // Hover states of primary
  content = content.replace(/bg-\[\#b12c21\]/g, 'bg-aakaa-green/90');

  // Replace text variations (was #4A1F1A)
  content = content.replace(/text-\[\#4A1F1A\]/g, 'text-aakaa-gold');
  content = content.replace(/bg-\[\#4A1F1A\]/g, 'bg-aakaa-gold');

  // Replace background variations (#FFF7F5, #F5EFEF, #FFF4EF, #fbfbfb, #ffeaea)
  content = content.replace(/bg-\[\#FFF7F5\]/g, 'bg-aakaa-cream');
  content = content.replace(/bg-\[\#F5EFEF\]/g, 'bg-aakaa-cream');
  content = content.replace(/bg-\[\#FFF4EF\]\/([0-9]+)/g, 'bg-aakaa-cream/$1');
  content = content.replace(/bg-\[\#FFF4EF\]/g, 'bg-aakaa-cream');

  content = content.replace(/from-\[\#ffeaea\]\/([0-9]+)/g, 'from-aakaa-cream/$1');
  content = content.replace(/via-\[\#fbfbfb\]\/([0-9]+)/g, 'via-aakaa-cream/$1');
  content = content.replace(/to-\[\#ffeaea\]\/([0-9]+)/g, 'to-aakaa-cream/$1');

  content = content.replace(/from-\[\#FFD4C7\]/g, 'from-aakaa-cream');
  content = content.replace(/via-\[\#FFE5DD\]/g, 'via-aakaa-cream/50');

  // Specific secondary text logic for waitlist pill
  content = content.replace(/bg-\[\#FFE1DB\]/g, 'bg-aakaa-gold/20');

  // Replace dark blue in footer
  content = content.replace(/bg-\[\#0b014b\]/g, 'bg-aakaa-green');

  fs.writeFileSync(file, content, 'utf8');
});

console.log("Replaced colors globally");
