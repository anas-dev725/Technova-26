const fs = require('fs');
const path = require('path');

try {
  const fileName = 'Talha Ahmed.jpeg';
  const filePath = path.join(process.cwd(), 'src/assets', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist.`);
    process.exit(1);
  }
  const buf = fs.readFileSync(filePath);
  const ext = 'jpeg';
  const code = `export const talhaAhmedBase64 = "data:image/${ext};base64,${buf.toString('base64')}";\n`;
  fs.writeFileSync(path.join(process.cwd(), 'src/assets/talhaAhmedBase64.ts'), code);
  console.log(`Created talhaAhmedBase64.ts successfully`);
} catch (e) {
  console.error(`Error processing image:`, e);
  process.exit(1);
}
