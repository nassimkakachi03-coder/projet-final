const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  'services/surgery.jpg': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800',
  'services/ortho.jpg': 'https://images.unsplash.com/photo-1593054941018-b27670788647?q=80&w=800',
  'services/general.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800',
  'results/case1_before.jpg': 'https://images.unsplash.com/photo-1593054941018-b27670788647?q=80&w=400',
  'results/case1_after.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400',
  'results/case2_before.jpg': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400',
  'results/case2_after.jpg': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=400',
  'results/case3_before.jpg': 'https://images.unsplash.com/photo-1593054941018-b27670788647?q=80&w=400',
  'results/case3_after.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400'
};

const baseDir = path.join(__dirname, '../../docmanag-landing/public/assets/images');

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
          download(response.headers.location, dest).then(resolve).catch(reject);
          return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const [relPath, url] of Object.entries(images)) {
    const fullPath = path.join(baseDir, relPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      await download(url, fullPath);
    } catch (e) {
      console.error(`Failed ${relPath}: ${e.message}`);
    }
  }
}

main();
