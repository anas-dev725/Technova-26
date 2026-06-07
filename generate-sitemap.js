import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://technova-26.vercel.app';

// Core static pages
const staticPages = [
  '',
  '/modules',
  '/sponsors',
  '/about',
  '/team',
  '/timeline',
  '/legacy',
];

const modulesFile = path.join(process.cwd(), 'src', 'data', 'modules.ts');
const publicDir = path.join(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function generateSitemap() {
  console.log('Generating automatic sitemap...');
  let moduleIds = [];

  try {
    const content = fs.readFileSync(modulesFile, 'utf8');
    // Module list items are indented with exactly 4 spaces, e.g. "    id: 'fyp-warriors',"
    const regex = /\s{4}id:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      moduleIds.push(match[1]);
    }
    console.log(`Found ${moduleIds.length} event modules:`, moduleIds);
  } catch (err) {
    console.error('Error reading modules data file:', err);
  }

  // Create XML elements
  const sitemapUrls = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Add static pages
  staticPages.forEach((route) => {
    sitemapUrls.push(`  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`);
  });

  // 2. Add dynamic modules and registration pages
  moduleIds.forEach((id) => {
    // Module Detail page
    sitemapUrls.push(`  <url>
    <loc>${BASE_URL}/modules/${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

    // Registration page for module
    sitemapUrls.push(`  <url>
    <loc>${BASE_URL}/register/${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;

  try {
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
    console.log(`Sitemap successfully created at ${sitemapPath}`);
  } catch (err) {
    console.error('Error writing sitemap.xml:', err);
  }
}

generateSitemap();
