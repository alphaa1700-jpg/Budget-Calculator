const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We want to replace $ followed by { (JSX variables)
  // but ONLY if it's preceded by > or + or - or whitespace.
  // Template literals in our code usually have ` or " or / before ${
  content = content.replace(/(^|[\s>+\-])\$\{/g, '$1₹{');

  // Also replace standard text $ like "$120"
  content = content.replace(/\$(?=[0-9])/g, '₹');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
