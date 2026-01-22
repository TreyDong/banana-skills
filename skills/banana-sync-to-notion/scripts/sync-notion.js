
const fs = require('fs');
const path = require('path');
const https = require('https');

// Simple .env parser since we might not have 'dotenv' installed
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
const SOURCE_DIR = path.resolve(__dirname, '../../../../Files');

if (!NOTION_TOKEN || !ROOT_PAGE_ID) {
    console.error('Error: NOTION_TOKEN and NOTION_ROOT_PAGE_ID are required in .agent/skills/sync-files/.env');
    process.exit(1);
}

// Progress tracking
let stats = {
    filesProcessed: 0,
    filesSkipped: 0,
    filesCreated: 0,
    foldersCreated: 0,
    errors: 0
};

// File path to Notion page ID mapping
// Key: relative file path from SOURCE_DIR (e.g., "01-基础入门/04-第一个Skill入门.md")
// Value: Notion page ID
const filePathToPageId = new Map();

// Notion API Helper with rate limit handling
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
                    // Rate limited - wait and retry
                    const retryAfter = parseInt(res.headers['retry-after']) || 1;
                    console.log(`Rate limited. Waiting ${retryAfter}s before retry...`);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get child pages of a parent
async function getChildPages(parentId) {
    try {
        const response = await notionRequest('blocks/' + parentId + '/children', 'GET');
        return response.results.filter(block => block.type === 'child_page');
    } catch (e) {
        console.error(`Failed to get child pages for ${parentId}:`, e.message);
        return [];
    }
}

// Find existing page by title
async function findPageByTitle(parentId, title) {
    const children = await getChildPages(parentId);
    for (const child of children) {
        if (child.child_page && child.child_page.title === title) {
            return child;
        }
    }
    return null;
}

// Split text into chunks that respect Notion's limits
function splitTextIntoChunks(text, maxLength = 2000) {
    const chunks = [];
    let currentChunk = '';

    for (const char of text) {
        if (currentChunk.length >= maxLength) {
            chunks.push(currentChunk);
            currentChunk = '';
        }
        currentChunk += char;
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

// Select appropriate icon based on title/filename
function selectIcon(title) {
    const titleLower = title.toLowerCase();

    // 关键词匹配规则
    const iconRules = [
        // 数字开头的章节
        { pattern: /^(\d+[-_.]|第\d+[章节课])/i, icon: '📖' },

        // 入门、基础
        { pattern: /(入门|基础|新手|初学|快速开始|getting.*started|beginner)/i, icon: '🎯' },

        // 问题、FAQ、故障
        { pattern: /(问题|faq|故障|trouble|issue|error)/i, icon: '❓' },

        // 案例、实战、示例
        { pattern: /(案例|实战|示例|example|demo|practice)/i, icon: '💡' },

        // 工具、软件
        { pattern: /(工具|软件|tool|app|claude|trae|antigravity|obsidian)/i, icon: '🔧' },

        // 方法、技巧、教程
        { pattern: /(方法|技巧|教程|guide|tutorial|how.*to)/i, icon: '📚' },

        // 数据、分析、报告
        { pattern: /(数据|分析|报告|统计|data|analysis|report|stats)/i, icon: '📊' },

        // 配置、设置
        { pattern: /(配置|设置|config|setting)/i, icon: '⚙️' },

        // 架构、系统、结构
        { pattern: /(架构|系统|结构|architecture|system|structure)/i, icon: '🏗️' },

        // 脚本、代码
        { pattern: /(脚本|代码|script|code)/i, icon: '💻' },

        // 选题、创作
        { pattern: /(选题|创作|写作|创建|create|write)/i, icon: '✍️' },

        // 笔记、记录
        { pattern: /(笔记|记录|复盘|note|review)/i, icon: '📝' },

        // 推荐、引擎
        { pattern: /(推荐|引擎|engine|recommend)/i, icon: '🚀' },

        // 使用指南
        { pattern: /(使用|指南|说明|manual|instruction)/i, icon: '📋' },

        // 术语、词汇
        { pattern: /(术语|词汇|glossary|term)/i, icon: '📖' },

        // 受众、用户
        { pattern: /(受众|用户|audience|user)/i, icon: '👥' },

        // 账号、个人
        { pattern: /(账号|个人|我的|account|profile)/i, icon: '👤' },

        // 下载、资源
        { pattern: /(下载|资源|download|resource)/i, icon: '📦' },

        // PPT、演示
        { pattern: /(ppt|slide|演示|presentation)/i, icon: '🎨' },

        // 文章、润色
        { pattern: /(文章|润色|polish|article)/i, icon: '📄' },

        // 管理、manager
        { pattern: /(管理|manager|manage)/i, icon: '📂' },

        // Skill相关
        { pattern: /(skill|技能)/i, icon: '🎓' },

        // 对比、区别、vs
        { pattern: /(对比|区别|比较|vs|versus|difference)/i, icon: '⚖️' },

        // 全局、项目
        { pattern: /(全局|项目|global|project)/i, icon: '🌐' },

        // 安装、部署
        { pattern: /(安装|部署|install|deploy)/i, icon: '📥' },

        // 附录、资料
        { pattern: /(附录|资料|appendix|reference)/i, icon: '📚' },

        // 备份、旧版
        { pattern: /(备份|旧版|backup|archive|old)/i, icon: '🗄️' },

        // 进阶、高级
        { pattern: /(进阶|高级|advanced)/i, icon: '🚀' },

        // 测试
        { pattern: /(test|测试|format)/i, icon: '🧪' },

        // README
        { pattern: /^readme/i, icon: '📘' }
    ];

    // 按顺序匹配规则
    for (const rule of iconRules) {
        if (rule.pattern.test(titleLower)) {
            return rule.icon;
        }
    }

    // 文件夹默认图标
    if (!title.includes('.')) {
        return '📁';
    }

    // 默认文档图标
    return '📄';
}

// Helper function to resolve relative file path and get Notion page URL
function resolveRelativeLink(currentFilePath, relativeLink) {
    // Remove leading ./ or ../
    // currentFilePath is relative to SOURCE_DIR (e.g., "01-基础入门/04-xxx.md")
    // relativeLink is like "./06-xxx.md" or "../02-进阶方法/01-xxx.md"

    // Get the directory of current file
    const currentDir = path.dirname(currentFilePath);

    // Resolve the relative path
    const targetPath = path.join(currentDir, relativeLink);

    // Normalize the path (handle ./ and ../)
    const normalizedPath = path.normalize(targetPath).replace(/\\/g, '/');

    // Look up the page ID from our mapping
    const pageId = filePathToPageId.get(normalizedPath);

    if (pageId) {
        // Return Notion page URL
        return `https://www.notion.so/${pageId.replace(/-/g, '')}`;
    }

    return null;
}

// Parse inline formatting (bold, italic, code, links) properly
function parseInlineFormatting(text, currentFilePath = null) {
    if (!text || text.trim() === '') {
        return [{ type: 'text', text: { content: '' } }];
    }

    const richText = [];

    // Process text and extract formatting
    // Order matters: process longer patterns first to avoid conflicts
    const patterns = [
        // Links must be first
        { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },
        // Bold + Italic (3 markers)
        { regex: /\*\*\*(.+?)\*\*\*/g, type: 'bold_italic' },
        { regex: /___(.+?)___/g, type: 'bold_italic' },
        // Bold (2 markers) - use negative lookahead/behind to avoid matching part of ***
        { regex: /(?<!\*)\*\*(?!\*)(.+?)(?<!\*)\*\*(?!\*)/g, type: 'bold' },
        { regex: /__(.+?)__/g, type: 'bold' },
        // Italic (1 marker) - use negative lookahead/behind to avoid matching part of ** or ***
        { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, type: 'italic' },
        { regex: /(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, type: 'italic' },
        // Code
        { regex: /`([^`]+)`/g, type: 'code' }
    ];

    // Find all matches with their positions
    const matches = [];
    for (const pattern of patterns) {
        const regex = new RegExp(pattern.regex.source, 'g');
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: regex.lastIndex,
                type: pattern.type,
                fullMatch: match[0],
                content: match[1],
                url: match[2] // for links
            });
        }
    }

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep the first one)
    const validMatches = [];
    let lastEnd = 0;
    for (const match of matches) {
        if (match.start >= lastEnd) {
            validMatches.push(match);
            lastEnd = match.end;
        }
    }

    // Build rich text array
    lastEnd = 0;
    for (const match of validMatches) {
        // Add plain text before this match
        if (match.start > lastEnd) {
            const plainText = text.substring(lastEnd, match.start);
            if (plainText) {
                addTextChunks(richText, plainText, {});
            }
        }

        // Add formatted text
        const annotations = {};
        if (match.type === 'bold') {
            annotations.bold = true;
        } else if (match.type === 'italic') {
            annotations.italic = true;
        } else if (match.type === 'bold_italic') {
            annotations.bold = true;
            annotations.italic = true;
        } else if (match.type === 'code') {
            annotations.code = true;
        }

        if (match.type === 'link') {
            const url = match.url;

            // Check if it's an absolute URL (http/https)
            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                addTextChunks(richText, match.content, {}, url);
            }
            // Check if it's a relative path to another markdown file
            else if (currentFilePath && url && (url.startsWith('./') || url.startsWith('../')) && url.endsWith('.md')) {
                const notionUrl = resolveRelativeLink(currentFilePath, url);
                if (notionUrl) {
                    // Found the target page, create a working Notion link
                    addTextChunks(richText, match.content, {}, notionUrl);
                } else {
                    // Target page not found yet, render as plain text
                    addTextChunks(richText, match.content, {});
                }
            }
            // Other types of links - render as plain text
            else {
                addTextChunks(richText, match.content, {});
            }
        } else {
            addTextChunks(richText, match.content, annotations);
        }

        lastEnd = match.end;
    }

    // Add remaining plain text
    if (lastEnd < text.length) {
        const remainingText = text.substring(lastEnd);
        if (remainingText) {
            addTextChunks(richText, remainingText, {});
        }
    }

    return richText.length > 0 ? richText : [{ type: 'text', text: { content: '' } }];
}

// Helper to add text chunks respecting 2000 char limit
function addTextChunks(richTextArray, text, annotations = {}, linkUrl = null) {
    const chunks = splitTextIntoChunks(text, 2000);
    for (const chunk of chunks) {
        const textObj = {
            type: 'text',
            text: { content: chunk }
        };

        if (linkUrl) {
            textObj.text.link = { url: linkUrl };
        }

        // Only add annotations if they exist
        if (Object.keys(annotations).length > 0) {
            textObj.annotations = annotations;
        }

        richTextArray.push(textObj);
    }
}

// Parse table rows
function parseTableRow(line) {
    // Split by | and trim, removing first and last empty elements
    const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
    return cells;
}

// Check if line is a table separator (like |---|---|---|)
function isTableSeparator(line) {
    return /^\|[\s\-:]+\|[\s\-:|]+\|/.test(line);
}

// Create a Notion native table block
function createTableBlock(tableRows, currentFilePath = null) {
    if (tableRows.length < 2) return null;

    // Parse all rows
    const parsedRows = [];
    let hasHeader = false;

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        if (isTableSeparator(row)) {
            hasHeader = true; // Separator indicates first row is header
        } else {
            parsedRows.push(parseTableRow(row));
        }
    }

    if (parsedRows.length === 0) return null;

    // Get table width (number of columns)
    const tableWidth = parsedRows[0].length;

    // Create table block
    const tableBlock = {
        object: 'block',
        type: 'table',
        table: {
            table_width: tableWidth,
            has_column_header: hasHeader,
            has_row_header: false,
            children: []
        }
    };

    // Add rows
    for (const row of parsedRows) {
        // Ensure row has correct number of cells
        const cells = [];
        for (let i = 0; i < tableWidth; i++) {
            const cellText = i < row.length ? row[i] : '';
            cells.push(parseInlineFormatting(cellText, currentFilePath));
        }

        tableBlock.table.children.push({
            object: 'block',
            type: 'table_row',
            table_row: {
                cells: cells
            }
        });
    }

    return tableBlock;
}

// Enhanced Markdown to Blocks converter
function markdownToBlocks(content, currentFilePath = null) {
    const lines = content.split('\n');
    const blocks = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent = [];
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Handle code blocks (support indented code blocks)
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                // End of code block
                const codeText = codeContent.join('\n');
                const codeChunks = splitTextIntoChunks(codeText, 2000);

                for (const chunk of codeChunks) {
                    blocks.push({
                        object: 'block',
                        type: 'code',
                        code: {
                            rich_text: [{ type: 'text', text: { content: chunk } }],
                            language: codeLanguage || 'plain text'
                        }
                    });
                }

                inCodeBlock = false;
                codeLanguage = '';
                codeContent = [];
            } else {
                // Start of code block
                inCodeBlock = true;
                codeLanguage = trimmedLine.substring(3).trim() || 'plain text';
            }
            continue;
        }

        if (inCodeBlock) {
            codeContent.push(line);
            continue;
        }

        // Handle tables
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            if (!inTable) {
                // Start of table
                inTable = true;
                tableRows = [];
                tableRows.push(line);
            } else if (isTableSeparator(line)) {
                // Table separator line, just record it
                tableRows.push(line);
            } else {
                // Table content row
                tableRows.push(line);
            }
            continue;
        } else if (inTable) {
            // End of table - process it
            if (tableRows.length >= 2) {
                const tableBlock = createTableBlock(tableRows, currentFilePath);
                if (tableBlock) {
                    blocks.push(tableBlock);
                }
            }
            inTable = false;
            tableRows = [];
            // Process current line normally (fall through)
        }

        // Skip empty lines
        if (line.trim() === '') {
            continue;
        }

        // Headings
        if (line.startsWith('### ')) {
            blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: { rich_text: parseInlineFormatting(line.substring(4), currentFilePath) }
            });
        } else if (line.startsWith('## ')) {
            blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: { rich_text: parseInlineFormatting(line.substring(3), currentFilePath) }
            });
        } else if (line.startsWith('# ')) {
            blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: { rich_text: parseInlineFormatting(line.substring(2), currentFilePath) }
            });
        }
        // Numbered list
        else if (/^\d+\.\s/.test(line)) {
            const content = line.replace(/^\d+\.\s/, '');
            blocks.push({
                object: 'block',
                type: 'numbered_list_item',
                numbered_list_item: { rich_text: parseInlineFormatting(content, currentFilePath) }
            });
        }
        // Bulleted list
        else if (line.startsWith('- ') || line.startsWith('* ')) {
            blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: { rich_text: parseInlineFormatting(line.substring(2), currentFilePath) }
            });
        }
        // Quote or Callout
        else if (line.startsWith('> ')) {
            const quoteContent = line.substring(2);

            // Check if it's a callout (starts with emoji)
            const emojiMatch = quoteContent.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s+(.+)/u);

            if (emojiMatch) {
                // It's a callout
                blocks.push({
                    object: 'block',
                    type: 'callout',
                    callout: {
                        rich_text: parseInlineFormatting(emojiMatch[2], currentFilePath),
                        icon: {
                            type: 'emoji',
                            emoji: emojiMatch[1]
                        }
                    }
                });
            } else {
                // Regular quote
                blocks.push({
                    object: 'block',
                    type: 'quote',
                    quote: { rich_text: parseInlineFormatting(quoteContent, currentFilePath) }
                });
            }
        }
        // Divider
        else if (line.trim() === '---' || line.trim() === '***') {
            blocks.push({
                object: 'block',
                type: 'divider',
                divider: {}
            });
        }
        // Regular paragraph
        else {
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: parseInlineFormatting(line, currentFilePath) }
            });
        }
    }

    // Handle unclosed table at end of file
    if (inTable && tableRows.length >= 2) {
        const tableBlock = createTableBlock(tableRows, currentFilePath);
        if (tableBlock) {
            blocks.push(tableBlock);
        }
    }

    return blocks;
}

// Create or update page with content
async function createOrUpdatePage(parentId, title, blocks = [], relativeFilePath = null) {
    // Check if page already exists
    const existingPage = await findPageByTitle(parentId, title);

    if (existingPage) {
        console.log(`  ⏭️  Skipping existing: ${title}`);
        stats.filesSkipped++;

        // Record the mapping for existing pages too
        if (relativeFilePath) {
            filePathToPageId.set(relativeFilePath, existingPage.id);
        }

        return existingPage;
    }

    // Select appropriate icon for this page
    const icon = selectIcon(title);
    console.log(`  ✨ Creating: ${icon} ${title}`);

    try {
        // Notion allows max 100 blocks per request
        const maxBlocksPerRequest = 100;
        let pageId = null;

        // Create page with first batch of blocks
        const firstBatch = blocks.slice(0, maxBlocksPerRequest);
        const page = await notionRequest('pages', 'POST', {
            parent: { page_id: parentId },
            icon: {
                type: 'emoji',
                emoji: icon
            },
            properties: {
                title: { title: [{ text: { content: title } }] }
            },
            children: firstBatch
        });

        pageId = page.id;
        stats.filesCreated++;

        // Record the mapping for newly created pages
        if (relativeFilePath) {
            filePathToPageId.set(relativeFilePath, pageId);
        }

        // If there are more blocks, append them
        if (blocks.length > maxBlocksPerRequest) {
            for (let i = maxBlocksPerRequest; i < blocks.length; i += maxBlocksPerRequest) {
                const batch = blocks.slice(i, i + maxBlocksPerRequest);
                await notionRequest(`blocks/${pageId}/children`, 'PATCH', {
                    children: batch
                });
                // Small delay to avoid rate limits
                await sleep(300);
            }
        }

        return page;
    } catch (e) {
        console.error(`  ❌ Failed to create page ${title}:`, e.message);
        stats.errors++;
        return null;
    }
}

async function syncDirectory(currentPath, parentId, depth = 0) {
    const items = fs.readdirSync(currentPath);
    const indent = '  '.repeat(depth);

    console.log(`${indent}📁 Syncing directory: ${path.basename(currentPath)}`);

    for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const fileStats = fs.statSync(fullPath);

        if (fileStats.isDirectory()) {
            // Create a page for the directory acting as a folder
            const existingPage = await findPageByTitle(parentId, item);
            let page;

            if (existingPage) {
                console.log(`${indent}  📂 Using existing folder: ${item}`);
                page = existingPage;
            } else {
                page = await createOrUpdatePage(parentId, item);
                if (page) {
                    stats.foldersCreated++;
                }
            }

            if (page) {
                await syncDirectory(fullPath, page.id, depth + 1);
            }
        } else if (fileStats.isFile()) {
            stats.filesProcessed++;

            if (item.endsWith('.md') || item.endsWith('.txt')) {
                // Calculate relative path from SOURCE_DIR
                const relativeFilePath = path.relative(SOURCE_DIR, fullPath).replace(/\\/g, '/');

                const content = fs.readFileSync(fullPath, 'utf8');
                const blocks = markdownToBlocks(content, relativeFilePath);
                await createOrUpdatePage(parentId, item, blocks, relativeFilePath);
            } else {
                // Non-text files - skip
                console.log(`${indent}  ⚠️  Skipping non-text: ${item}`);
            }
        }
    }
}

async function main() {
    console.log('\n🚀 Starting Notion Sync...');
    console.log(`📂 Source: ${SOURCE_DIR}`);
    console.log(`📄 Target Page: ${ROOT_PAGE_ID}\n`);

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    const startTime = Date.now();

    try {
        await syncDirectory(SOURCE_DIR, ROOT_PAGE_ID);

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n' + '='.repeat(50));
        console.log('✅ Sync Complete!');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`📊 Statistics:`);
        console.log(`   • Files processed: ${stats.filesProcessed}`);
        console.log(`   • Files created: ${stats.filesCreated}`);
        console.log(`   • Files skipped: ${stats.filesSkipped}`);
        console.log(`   • Folders created: ${stats.foldersCreated}`);
        console.log(`   • Errors: ${stats.errors}`);
        console.log('='.repeat(50) + '\n');

        if (stats.errors > 0) {
            console.log('⚠️  Some errors occurred during sync. Check logs above for details.');
            process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ Sync failed:', error.message);
        process.exit(1);
    }
}

main();
