const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  'services/surgery.jpg': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800',
  'services/ortho.jpg': 'https://images.unsplash.com/photo-1593054941018-b27670788647?q=80&w=800',
  'services/general.jpg': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800',
  'results/case1_before.jpg': 'https://images.unsplash.com/photo-1593054941018-b27670788647?q=80&w=400',
  'results/case1_after.jpg': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=400',
  'results/case2_before.jpg': 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=400',
  'results/case2_after.jpg': 'https://images.unsplash.com/photo-1542601039-1dca5e054718?q=80&w=400',
  'results/case3_before.jpg': 'https://images.unsplash.com/photo-1593054941018-b27670788647?q=80&w=400',
  'results/case3_after.jpg': 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=400'
};

const baseDir = path.join(__dirname, '../../docmanag-landing/public/assets/images');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`OK: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(images)) {
    const fullPath = path.join(baseDir, name);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      await download(url, fullPath);
    } catch (e) {
      console.error(`ERR ${name}: ${e.message}`);
    }
  }
}

run();
