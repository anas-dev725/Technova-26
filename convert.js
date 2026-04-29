const fs = require('fs');
const path = require('path');

function convertToBase64AndSave(filePath, targetPath, exportName) {
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1);
  const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/svg+xml';
  const base64 = `data:${mimeType};base64,${data.toString('base64')}`;
  const tsContent = `export const ${exportName} = '${base64}';\n`;
  fs.writeFileSync(targetPath, tsContent);
}

convertToBase64AndSave('src/assets/iobm-logo.png', 'src/assets/iobmLogoBase64.ts', 'iobmLogoBase64');
convertToBase64AndSave('src/assets/ccsis-logo.png', 'src/assets/ccsisLogoBase64.ts', 'ccsisLogoBase64');
convertToBase64AndSave('src/assets/ieee_logo.jpeg', 'src/assets/ieeeLogoBase64.ts', 'ieeeLogoBase64');
