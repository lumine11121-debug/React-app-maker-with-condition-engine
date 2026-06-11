const fs = require('fs');
const path = require('path');

const folders = ['Complex', 'Medium'];
const indexLines = [];

// Helper to extract a field from a fulfiller text
function extractField(content, fieldName) {
  const regex = new RegExp(`- \\*\\*${fieldName}\\*\\*: (.+)`);
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

for (const folder of folders) {
  const folderPath = path.join(__dirname, 'fulfillers', folder);
  if (!fs.existsSync(folderPath)) continue;
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (!file.endsWith('.txt')) continue;
    const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
    const name = extractField(content, 'Name');
    const purpose = extractField(content, 'Purpose');
    if (name && purpose) {
      indexLines.push(`## ${name} (${folder})\n- ${purpose}\n- File: fulfillers/${folder}/${file}\n`);
    }
  }
}

const indexContent = `# FULFILLER INDEX\n\nLast generated: ${new Date().toISOString()}\n\n${indexLines.join('\n')}`;
fs.writeFileSync(path.join(__dirname, 'fulfillers', 'Index.txt'), indexContent);
console.log('Index.txt regenerated successfully.');
