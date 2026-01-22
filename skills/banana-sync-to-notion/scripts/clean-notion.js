const fs = require('fs');
const path = require('path');
const https = require('https');

// Simple .env parser
function loadEnv() {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
    }
}

loadEnv();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const ROOT_PAGE_ID = process.env.NOTION_ROOT_PAGE_ID;

if (!NOTION_TOKEN || !ROOT_PAGE_ID) {
    console.error('Error: NOTION_TOKEN and NOTION_ROOT_PAGE_ID are required');
    process.exit(1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Notion API Helper
async function notionRequest(endpoint, method, body, retries = 3) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.notion.com',
            path: '/v1/' + endpoint,
            method: method,
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else if (res.statusCode === 429 && retries > 0) {
                    const retryAfter = parseInt(res.headers['retry-after']) || 1;
                    console.log(`Rate limited. Waiting ${retryAfter}s...`);
                    await sleep(retryAfter * 1000);
                    resolve(await notionRequest(endpoint, method, body, retries - 1));
                } else {
                    reject(new Error(`Notion API Error ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', error => reject(error));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

// Get all child pages
async function getChildPages(parentId) {
    try {
        const response = await notionRequest('blocks/' + parentId + '/children', 'GET');
        return response.results.filter(block => block.type === 'child_page');
    } catch (e) {
        console.error(`Failed to get children:`, e.message);
        return [];
    }
}

// Delete a block
async function deleteBlock(blockId) {
    try {
        await notionRequest('blocks/' + blockId, 'DELETE');
        return true;
    } catch (e) {
        console.error(`Failed to delete block ${blockId}:`, e.message);
        return false;
    }
}

// Recursively delete all child pages
async function deleteAllChildren(parentId, indent = '') {
    const children = await getChildPages(parentId);

    for (const child of children) {
        const title = child.child_page ? child.child_page.title : 'Untitled';
        console.log(`${indent}🗑️  Deleting: ${title}`);

        // Delete this page
        const success = await deleteBlock(child.id);
        if (success) {
            // Small delay to avoid rate limits
            await sleep(300);
        }
    }

    return children.length;
}

async function main() {
    console.log('\n⚠️  NOTION CLEANUP SCRIPT');
    console.log('This will delete ALL child pages under the target page.');
    console.log(`Target Page ID: ${ROOT_PAGE_ID}\n`);

    console.log('Starting cleanup in 3 seconds...');
    await sleep(3000);

    const startTime = Date.now();

    try {
        const deletedCount = await deleteAllChildren(ROOT_PAGE_ID);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n' + '='.repeat(50));
        console.log('✅ Cleanup Complete!');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`🗑️  Pages deleted: ${deletedCount}`);
        console.log('='.repeat(50) + '\n');
    } catch (error) {
        console.error('\n❌ Cleanup failed:', error.message);
        process.exit(1);
    }
}

main();
