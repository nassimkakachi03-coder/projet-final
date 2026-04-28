const https = require('https');

async function fetchWikiImages(article) {
    return new Promise((resolve, reject) => {
        https.get('https://en.wikipedia.org/wiki/' + article, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const regex = /<img[^>]+src="(\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^"]+)"/gi;
                let match;
                const urls = [];
                while ((match = regex.exec(data)) !== null) {
                    let url = 'https:' + match[1];
                    // Replace the thumbnail size param with 800px if it exists
                    url = url.replace(/\/\d+px-/, '/800px-');
                    urls.push(url);
                }
                resolve(urls);
            });
        }).on('error', reject);
    });
}

(async () => {
    const braces = await fetchWikiImages('Dental_braces');
    console.log('Braces imgs:', braces.slice(0,5));
    const dentistry = await fetchWikiImages('Dentistry');
    console.log('Dentistry imgs:', dentistry.slice(0,5));
    const diastema = await fetchWikiImages('Diastema_(dentistry)');
    console.log('Diastema imgs:', diastema.slice(0,5));
    const bleaching = await fetchWikiImages('Tooth_bleaching');
    console.log('Bleach imgs:', bleaching.slice(0,5));
})();
