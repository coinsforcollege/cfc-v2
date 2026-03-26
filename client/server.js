import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DIST = join(__dirname, 'dist');

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

const SITE_URL = 'https://coinsforcollege.org';

const pageMeta = {
  '/wings-scholarship': {
    title: 'CFC Wings Scholarship Program 2026 | Coins For College',
    description: 'Apply for up to 100% scholarship to study abroad. 100 scholarships across USA, UK, Canada, Australia, Germany, and Singapore. Register for the CFC Education Fair to begin your application.',
    image: `${SITE_URL}/og-scholarship.jpg`,
    url: `${SITE_URL}/wings-scholarship`,
  },
  '/college-coins': {
    title: 'College Coins | Coins For College',
    description: 'Transform your scholarship program with branded digital coins. Create a thriving campus economy that attracts top talent and boosts enrollment.',
    image: `${SITE_URL}/og_college_coin.jpg`,
    url: `${SITE_URL}/college-coins`,
  },
};

function injectMeta(html, meta) {
  if (!meta) return html;

  const replacements = [
    // Title
    [/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`],
    [/<meta name="title" content="[^"]*"/, `<meta name="title" content="${meta.title}"`],
    // Description
    [/<meta name="description" content="[^"]*"/, `<meta name="description" content="${meta.description}"`],
    // OG
    [/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${meta.title}"`],
    [/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${meta.description}"`],
    [/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${meta.image}"`],
    [/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${meta.url}"`],
    // Twitter
    [/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${meta.title}"`],
    [/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${meta.description}"`],
    [/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${meta.image}"`],
    [/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${meta.url}"`],
    // Canonical
    [/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${meta.url}"`],
  ];

  let result = html;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// Serve static assets (js, css, images, etc.) directly
app.use(express.static(DIST, { index: false }));

// All other routes: serve index.html with injected meta
app.get('/{*path}', (req, res) => {
  const meta = pageMeta[req.path];
  const html = injectMeta(indexHtml, meta);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Client server running on port ${PORT}`);
});
