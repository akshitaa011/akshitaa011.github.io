import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Ensure .nojekyll in root and dist
fs.writeFileSync('.nojekyll', '');
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/.nojekyll', '');
}

// 2. Copy dist/assets to ./assets
if (fs.existsSync('dist/assets')) {
  copyDir('dist/assets', 'assets');
}

// 3. Copy dist/index.html to ./index.html
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'index.html');
}

// 4. Copy dist to ./docs (for GitHub Pages folder /docs option)
if (fs.existsSync('dist')) {
  copyDir('dist', 'docs');
}

console.log('[Deploy Sync] Synced production build to root (index.html, assets/), ./docs, and created .nojekyll');
