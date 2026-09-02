const fs = require('fs');
let c = fs.readFileSync('src/components/forms/CategoryForm.tsx', 'utf8');
c = c.replace('const result = await createRecord, updateRecord("Categories"', 'const result = await createRecord("Categories"');
fs.writeFileSync('src/components/forms/CategoryForm.tsx', c);
console.log('Fixed CategoryForm');
