const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourceIndexPath = path.join(root, 'index.html');
const distIndexPath = path.join(root, 'dist', 'index.html');
const targetIndexPath = fs.existsSync(distIndexPath)
  ? distIndexPath
  : sourceIndexPath;

if (!fs.existsSync(sourceIndexPath)) {
  console.error('Missing index.html at project root.');
  process.exit(1);
}

const sourceHtml = fs.readFileSync(sourceIndexPath, 'utf8');
const targetHtml = fs.readFileSync(targetIndexPath, 'utf8');

const templateMatch = sourceHtml.match(
  /<script id="app-template"[^>]*>([\s\S]*?)<\/script>/
);

if (!templateMatch) {
  console.error('Missing #app-template in index.html.');
  process.exit(1);
}

let templateHtml = templateMatch[1];
const partialRegex = /\{\{\s*>\s*([a-zA-Z0-9_-]+)\s*\}\}/g;

templateHtml = templateHtml.replace(partialRegex, (_match, name) => {
  const partialPath = path.join(root, 'components', `${name}.hbs`);
  if (!fs.existsSync(partialPath)) {
    throw new Error(`Missing partial: components/${name}.hbs`);
  }
  return fs.readFileSync(partialPath, 'utf8');
});

const updatedHtml = targetHtml.replace(
  /<div id="app"><\/div>/,
  `<div id="app">${templateHtml}</div>`
);

if (updatedHtml === targetHtml) {
  console.error('Failed to inline template into #app.');
  process.exit(1);
}

fs.writeFileSync(targetIndexPath, updatedHtml, 'utf8');
console.log(`Inlined components into ${path.relative(root, targetIndexPath)}.`);
