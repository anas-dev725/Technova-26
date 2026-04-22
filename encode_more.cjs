const fs = require('fs');
const path = require('path');

const files = [
  { name: 'technova1', file: 'technova-1.jpg' },
  { name: 'technova4', file: 'technova-4.jpg' },
  { name: 'technova5', file: 'technova-5.jpg' }
];

let code = '';
for (const f of files) {
  if (fs.existsSync(path.join(process.cwd(), 'src/assets', f.file))) {
    const buf = fs.readFileSync(path.join(process.cwd(), 'src/assets', f.file));
    code += `\nexport const ${f.name}Base64 = "data:image/jpeg;base64,${buf.toString('base64')}";\n`;
  }
}

fs.appendFileSync(path.join(process.cwd(), 'src/assets/photosBase64.ts'), code);
console.log("Appended remaining photos to photosBase64.ts");
