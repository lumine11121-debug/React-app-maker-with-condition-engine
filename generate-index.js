const fs = require('fs');
const path = require('path');

const FULFILLERS_DIR = path.join(__dirname, 'fulfillers');
const OUTPUT_FILE = path.join(FULFILLERS_DIR, 'Index.txt');

// Helper: extract field from spec.txt content using regex
function extractField(content, fieldName) {
    const regex = new RegExp(`^- \\*\\*${fieldName}\\*\\*: (.*)$`, 'm');
    const match = content.match(regex);
    if (match) return match[1].trim();
    return '';
}

function extractPurpose(content) {
    // Purpose is on the line after "- **Purpose**: "
    const regex = /^- \*\*Purpose\*\*: (.*)$/m;
    const match = content.match(regex);
    if (match) return match[1].trim();
    return '';
}

function truncate(str, maxLen = 80) {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen - 3) + '...';
}

function scanDirectory(dir, relativePath = '') {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;
        if (entry.isDirectory()) {
            results = results.concat(scanDirectory(fullPath, relPath));
        } else if (entry.isFile() && entry.name === 'spec.txt') {
            const content = fs.readFileSync(fullPath, 'utf8');
            const name = extractField(content, 'Name');
            const version = extractField(content, 'Version');
            const complexity = extractField(content, 'Complexity');
            let purpose = extractPurpose(content);
            if (!purpose) purpose = extractField(content, 'Purpose');
            const displayName = version ? `${name} (${version})` : name;
            const shortPurpose = truncate(purpose, 80);
            // Use directory of spec.txt as path (excluding 'spec.txt')
            const specDir = path.dirname(relPath);
            results.push({
                name: displayName,
                complexity,
                purpose: shortPurpose,
                path: specDir,
            });
        }
    }
    return results;
}

function generateIndex() {
    if (!fs.existsSync(FULFILLERS_DIR)) {
        console.error(`Error: ${FULFILLERS_DIR} not found.`);
        process.exit(1);
    }
    const items = scanDirectory(FULFILLERS_DIR);
    if (items.length === 0) {
        console.log('No spec.txt files found.');
        return;
    }
    // Sort alphabetically by name
    items.sort((a, b) => a.name.localeCompare(b.name));
    const lines = items.map(item => `${item.name} | ${item.complexity} | ${item.purpose} | ${item.path}`);
    const output = lines.join('\n');
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
    console.log(`Index written to ${OUTPUT_FILE} (${items.length} fulfillers)`);
}

generateIndex();
