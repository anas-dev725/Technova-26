const fs = require('fs');
const path = require('path');

try {
  // 1. Logo
  const logoPath = path.join(process.cwd(), 'src/assets/technova-logo.png');
  const logoObj = fs.readFileSync(logoPath);
  const logoB64 = `export const logoBase64 = "data:image/png;base64,${logoObj.toString('base64')}";\n`;
  fs.writeFileSync(path.join(process.cwd(), 'src/assets/logoBase64.ts'), logoB64);
  console.log("Created logoBase64.ts");

  // 2. Sponsor Logos
  const sponsors = ['bbraun-logo.jpg', 'telec-logo.jpg', 'express-news-logo.jpg', 'texitech-logo.jpg'];
  const sponsorNames = ['bBraunLogo', 'telecLogo', 'expressNewsLogo', 'texitechLogo'];

  let sponsorCode = `// Technova'26 Sponsor Logos - Base64 Encoded\n`;
  for(let i=0; i<sponsors.length; i++) {
    const buf = fs.readFileSync(path.join(process.cwd(), 'src/assets', sponsors[i]));
    sponsorCode += `export const ${sponsorNames[i]} = "data:image/jpeg;base64,${buf.toString('base64')}";\n`;
  }

  fs.writeFileSync(path.join(process.cwd(), 'src/assets/sponsor-logos.ts'), sponsorCode);
  console.log("Updated sponsor-logos.ts");
} catch (err) {
  console.error("Error encoding:", err);
}
