const https = require('https');
const fs = require('fs');

async function searchWikiCommons(query) {
    return new Promise((resolve, reject) => {
        const url = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(query) + '&srlimit=3&format=json';
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const parsed = JSON.parse(data);
                const titles = parsed.query.search.map(s => s.title);
                resolve(titles);
            });
        }).on('error', reject);
    });
}

function fetchFileUrl(filename) {
    return new Promise((resolve, reject) => {
        const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(filename) + '&prop=imageinfo&iiprop=url&format=json';
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query.pages;
                    const pageId = Object.keys(pages)[0];
                    resolve(pages[pageId].imageinfo[0].url);
                } catch(e) { resolve(null); }
            });
        });
    });
}

async function download(url, dest) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => resolve(true));
        });
    });
}

(async () => {
    try {
        console.log("Searching for accurate images...");
        
        let surgeryFiles = ['File:Dentistry in a hospital.jpg'];
        let orthoFiles = ['File:Orthodontist at work.jpg', 'File:Clear aligner invisalign transparent.jpg'];
        let bracesFiles = ['File:Dental braces.jpg', 'File:Braces crossbite.jpg', 'File:Traditional metal braces.jpg'];
        let straightFiles = ['File:Tooth with braces(1).jpg', 'File:Healthy smile.jpg'];
        let diastemaFiles = ['File:Diastema.JPG'];

        // Just fetch these known titles!
        const filesToFetch = [
            { query: 'File:Doctor dental practice.jpg', target: 'services/surgery.jpg' },
            { query: 'File:Orthodontic Braces.jpg', target: 'services/ortho.jpg' },
            { query: 'File:Dentist performing a check-up.jpg', target: 'services/general.jpg' },
            
            { query: 'File:Teeth crowding.jpg', target: 'results/case1_before.jpg' },
            { query: 'File:Teeth after braces.jpg', target: 'results/case1_after.jpg' },
            
            { query: 'File:Diastema.JPG', target: 'results/case2_before.jpg' },
            { query: 'File:Dentition.jpg', target: 'results/case2_after.jpg' },
            
            { query: 'File:Overbite before.jpg', target: 'results/case3_before.jpg' },
            { query: 'File:Overbite after.jpg', target: 'results/case3_after.jpg' },
        ];

        /* Alternatively, let's search for actual files on commons! */
        console.log("Searching terms...");
        const resDentist = await searchWikiCommons('dentist surgery clinic');
        console.log('Dentist:', resDentist);
        
        const resBraces = await searchWikiCommons('orthodontic braces teeth');
        console.log('Braces:', resBraces);

        const resSmile = await searchWikiCommons('perfect straight teeth smile');
        console.log('Smile:', resSmile);

        const resGaps = await searchWikiCommons('diastema gap teeth');
        console.log('Gaps:', resGaps);

        // Map results if available
        const listToDL = [];
        if(resDentist.length > 0) listToDL.push({ f: resDentist[0], p: 'services/surgery.jpg' });
        if(resDentist.length > 1) listToDL.push({ f: resDentist[1], p: 'services/general.jpg' });
        if(resBraces.length > 0) listToDL.push({ f: resBraces[0], p: 'services/ortho.jpg' });
        
        if(resBraces.length > 1) listToDL.push({ f: resBraces[1], p: 'results/case1_before.jpg' });
        if(resSmile.length > 0) listToDL.push({ f: resSmile[0], p: 'results/case1_after.jpg' });

        if(resGaps.length > 0) listToDL.push({ f: resGaps[0], p: 'results/case2_before.jpg' });
        if(resSmile.length > 1) listToDL.push({ f: resSmile[1], p: 'results/case2_after.jpg' });

        if(resBraces.length > 2) listToDL.push({ f: resBraces[2], p: 'results/case3_before.jpg' });
        if(resSmile.length > 2) listToDL.push({ f: resSmile[2], p: 'results/case3_after.jpg' });

        for (let item of listToDL) {
            console.log('Fetching URL for:', item.f);
            const url = await fetchFileUrl(item.f);
            if(url) {
                console.log('Downloading:', url, "to", item.p);
                await download(url, 'docmanag-landing/public/assets/images/' + item.p);
            }
        }
    } catch(e) {
        console.error("FATAL ERROR", e);
    }
})();
