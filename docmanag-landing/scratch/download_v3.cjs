const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { name: 'services/surgery.jpg', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop' },
  { name: 'services/ortho.jpg', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop' },
  { name: 'services/general.jpg', url: 'https://images.unsplash.com/photo-1597762470488-3877b1f538c6?q=80&w=800&auto=format&fit=crop' },
  { name: 'results/case1_before.jpg', url: 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?q=80&w=800&auto=format&fit=crop' },
  { name: 'results/case1_after.jpg', url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800&auto=format&fit=crop' },
  { name: 'results/case2_before.jpg', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop' },
  { name: 'results/case2_after.jpg', url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=800&auto=format&fit=crop' },
  { name: 'results/case3_before.jpg', url: 'https://images.unsplash.com/photo-1510523132584-fa981c3ba4d6?q=80&w=800&auto=format&fit=crop' },
  { name: 'results/case3_after.jpg', url: 'https://images.unsplash.com/photo-1533682805518-48d1f5b8cd3a?q=80&w=800&auto=format&fit=crop' }
];

const baseDir = path.join(__dirname, '../../docmanag-landing/public/assets/images');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(dest).size;
        if (size < 20000) {
            reject(new Error(`File too small: ${size} bytes`));
        } else {
            console.log(`SUCCESS [${size} bytes]: ${dest}`);
            resolve();
        }
      });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting final image download sequence...');
  for (const img of images) {
    const fullPath = path.join(baseDir, img.name);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    try {
      await download(img.url, fullPath);
    } catch (e) {
      console.error(`FAILED: ${img.name} -> ${e.message}`);
    }
  }
}

run();
