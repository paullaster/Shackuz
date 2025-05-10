// esm-fix.js
// Efficiently rewrites import/export paths in ESM output to include .js extensions for Node.js compatibility.
// Usage: node scripts/esm-fix.js dist

const fs = require('fs');
const path = require('path');

const JS_EXT = '.js';
const IMPORT_EXPORT_REGEX = /((?:import|export)\s+(?:[^'";]+?\s+from\s+)?["'])(\.\.?\/[^'";]+?)(["'])/g;
const DYNAMIC_IMPORT_REGEX = /(import\s*\(\s*["'])(\.\.?\/[^'";]+?)(["'])/g;

function addJsExtension(importPath) {
    if (importPath.endsWith(JS_EXT) || importPath.match(/\.[tj]sx?$/)) return importPath;
    return importPath + JS_EXT;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    content = content.replace(IMPORT_EXPORT_REGEX, (match, p1, p2, p3) => {
        const newPath = addJsExtension(p2);
        if (newPath !== p2) changed = true;
        return p1 + newPath + p3;
    });

    content = content.replace(DYNAMIC_IMPORT_REGEX, (match, p1, p2, p3) => {
        const newPath = addJsExtension(p2);
        if (newPath !== p2) changed = true;
        return p1 + newPath + p3;
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Rewritten: ${filePath}`);
    }
}

function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(JS_EXT)) {
            processFile(fullPath);
        }
    }
}

if (process.argv.length < 3) {
    console.error('Usage: node scripts/esm-fix.js <dist-directory>');
    process.exit(1);
}

const targetDir = process.argv[2];
if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
}

walkDir(targetDir);
console.log('✅ ESM import/export path rewriting complete.');
