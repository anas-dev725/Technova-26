const fs = require('fs');
const path = require('path');

const images = [
  { name: 'technova2', file: 'technova-2.jpg' },
  { name: 'technova6', file: 'technova-6.jpg' },
  { name: 'technova7', file: 'technova-7.jpg' },
  { name: 'technova8', file: 'technova-8.jpg' },
  { name: 'technova9', file: 'technova-9.jpg' }
];

images.forEach(img => {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'src/assets', img.file));
    const ext = path.extname(img.file).replace('.', '');
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    const code = `export const ${img.name}Base64 = "data:image/${mime};base64,${buf.toString('base64')}";\n`;
    fs.writeFileSync(path.join(process.cwd(), 'src/assets', `${img.name}Base64.ts`), code);
    console.log(`Created ${img.name}Base64.ts successfully`);
  } catch (e) {
    console.error(`Error processing ${img.file}:`, e);
  }
});
