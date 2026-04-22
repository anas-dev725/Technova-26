const fs = require('fs');
const path = require('path');

try {
  const anasBuf = fs.readFileSync(path.join(process.cwd(), 'src/assets/anas-profile.jpg'));
  const tech3Buf = fs.readFileSync(path.join(process.cwd(), 'src/assets/technova-3.jpg'));
  
  const code = `export const anasProfileBase64 = "data:image/jpeg;base64,${anasBuf.toString('base64')}";\nexport const technova3Base64 = "data:image/jpeg;base64,${tech3Buf.toString('base64')}";\n`;
  
  fs.writeFileSync(path.join(process.cwd(), 'src/assets/photosBase64.ts'), code);
  console.log("Created photosBase64.ts successfully");
} catch (e) {
  console.error("Error creating Base64 code:", e);
}
