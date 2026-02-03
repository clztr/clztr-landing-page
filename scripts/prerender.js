import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('prerender: dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const templateMatch = html.match(
  /<script[^>]*id=["']app-template["'][^>]*>([\s\S]*?)<\/script>/
);

if (!templateMatch) {
  console.warn('prerender: app-template not found, skipping.');
  process.exit(0);
}

let template = templateMatch[1];

template = template.replace(/\{\{!--[\s\S]*?--\}\}/g, '');

const partialRegex = /\{\{\s*>\s*([A-Za-z0-9_-]+)\s*\}\}/g;

let missing = false;
const rendered = template.replace(partialRegex, (_, name) => {
  const partialPath = path.join(distDir, 'components', `${name}.hbs`);
  if (!fs.existsSync(partialPath)) {
    console.error(`prerender: missing partial ${name} at ${partialPath}`);
    missing = true;
    return '';
  }
  return fs.readFileSync(partialPath, 'utf8');
});

if (missing) {
  process.exit(1);
}

const appRegex = /<div id=["']app["']>[\s\S]*?<\/div>/;
if (!appRegex.test(html)) {
  console.warn('prerender: app container not found, skipping.');
  process.exit(0);
}

const injected = html.replace(appRegex, `<div id="app">${rendered}</div>`);
const stamp = process.env.BUILD_STAMP || new Date().toISOString().replace(/[:.]/g, '-');
const stamped = injected
  .replace(/href=["']\/tailwind\.css["']/g, `href="/tailwind.css?v=${stamp}"`)
  .replace(/src=["']\/app\.js["']/g, `src="/app.js?v=${stamp}"`);

fs.writeFileSync(indexPath, stamped, 'utf8');
console.log('prerender: injected app HTML into dist/index.html');
