const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Safely map array functions
  content = content.replace(/=\s+([a-zA-Z0-9_]+)\.filter\(/g, '= ($1 || []).filter(');
  content = content.replace(/=\s+([a-zA-Z0-9_]+)\.sort\(/g, '= ($1 || []).sort(');
  content = content.replace(/([a-zA-Z0-9_]+)\s*=\s*cats;/g, '$1 = cats || [];');

  // Fix accounts in page.tsx if there's reduce
  content = content.replace(/([a-zA-Z0-9_]+)\.reduce\(/g, '($1 || []).reduce(');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  }
});
