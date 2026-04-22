const fs = require('fs');
const path = require('path');

const files = [
  { name: 'anasProfile', file: 'anas-profile.jpg' },
  { name: 'technova3', file: 'technova-3.jpg' },
  { name: 'technova1', file: 'technova-1.jpg' },
  { name: 'technova4', file: 'technova-4.jpg' },
  { name: 'technova5', file: 'technova-5.jpg' }
];

let code = '';
for (const f of files) {
  if (fs.existsSync(path.join(process.cwd(), 'src/assets', f.file))) {
    const buf = fs.readFileSync(path.join(process.cwd(), 'src/assets', f.file));
    let base64 = buf.toString('base64');
    
    // Chunking the string to prevent editor truncation
    const CHUNK_SIZE = 5000;
    let chunks = [];
    chunks.push(`"data:image/jpeg;base64,"`);
    for (let i = 0; i < base64.length; i += CHUNK_SIZE) {
      chunks.push(`"${base64.slice(i, i + CHUNK_SIZE)}"`);
    }
    
    code += `\nexport const ${f.name}Base64 = \n  ${chunks.join(' +\n  ')};\n`;
  }
}

fs.writeFileSync(path.join(process.cwd(), 'src/assets/photosBase64.ts'), code);
console.log("Re-generated photosBase64.ts with chunked string literals.");
