const fs = require('fs');
const path = require('path');

function generateBase64(fileName, exportName, mimeType, outFileName) {
  const filePath = path.join(__dirname, 'src/assets', fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const fileData = fs.readFileSync(filePath);
  const base64Str = fileData.toString('base64');
  const fileContent = `export const ${exportName} = "data:${mimeType};base64,${base64Str}";\n`;
  fs.writeFileSync(path.join(__dirname, 'src/assets', outFileName), fileContent);
  console.log(`Generated ${outFileName}`);
}

generateBase64('favicon.png', 'faviconBase64', 'image/png', 'favicon-base64.ts');
generateBase64('technova-1.jpg', 'technova_1Base64', 'image/jpeg', 'technova-1-base64.ts');
generateBase64('technova-2.jpg', 'technova_2Base64', 'image/jpeg', 'technova-2-base64.ts');
generateBase64('technova-3.jpg', 'technova_3Base64', 'image/jpeg', 'technova-3-base64.ts');
generateBase64('technova-4.jpg', 'technova_4Base64', 'image/jpeg', 'technova-4-base64.ts');
generateBase64('technova-5.jpg', 'technova_5Base64', 'image/jpeg', 'technova-5-base64.ts');
