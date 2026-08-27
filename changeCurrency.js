const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
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

  // Replace $ when it's immediately before a JSX expression like ${Number(tx.amount).toFixed(2)}
  // e.g. >${ -> >₹{
  content = content.replace(/>\$\{/g, '>₹{');
  
  // e.g. +${ -> +₹{
  content = content.replace(/\+\$\{/g, '+₹{');
  
  // e.g. -${ -> -₹{
  content = content.replace(/-\$\{/g, '-₹{');
  
  // Replace $ USD -> ₹ INR
  content = content.replace(/\$ USD/g, '₹ INR');
  
  // What if it's like >$232.00< ?
  // Replace $ followed by a digit
  content = content.replace(/\$(?=[0-9])/g, '₹');
  
  // What about +$232 ?
  content = content.replace(/\+\$(?=[0-9])/g, '+₹');
  content = content.replace(/-\$(?=[0-9])/g, '-₹');
  
  // "spent of ${monthlyBudget} budget" -> "spent of ₹{monthlyBudget} budget"
  // Here we have "spent of ${" which is inside a JSX text node
  // It's safe to replace ${ if it's preceded by a space and it's in a text node, but regex is risky.
  content = content.replace(/of \$\{monthlyBudget\}/g, 'of ₹{monthlyBudget}');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated currency in ' + file);
  }
});
