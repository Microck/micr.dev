#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ISSUES = {
  emptyCatch: [],
  commentedConsole: [],
  consoleLog: [],
};

let issueCount = 0;

function scanDirectory(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && 
!entry.name.startsWith('.') && 
!entry.name.includes('node_modules')) {
      scanDirectory(fullPath, baseDir);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      scanFile(fullPath, baseDir);
    }
  }
}

function scanFile(filePath, baseDir) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(baseDir, filePath);
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    if (/^\s*}\s*catch\s*\(\s*\w+\s*\)\s*\{\s*\}/.test(line)) {
      ISSUES.emptyCatch.push({ file: relativePath, line: lineNum, code: line.trim() });
      issueCount++;
    }

    if (/\/\/\s*console\./.test(line)) {
      ISSUES.commentedConsole.push({ file: relativePath, line: lineNum, code: line.trim() });
      issueCount++;
    }

    if (/console\.log\(/.test(line) &&
!/^\s*\/\//.test(line)) {
      ISSUES.consoleLog.push({ file: relativePath, line: lineNum });
    }
  });
}

function main() {
  const rootDir = path.resolve(__dirname, '..');

  console.log('🔍 Scanning for logging issues...\n');
  scanDirectory(rootDir);

  console.log(`📊 Results:\n`);
  console.log(`❌ Empty catch blocks: ${ISSUES.emptyCatch.length}`);
  console.log(`📝 Commented console statements: ${ISSUES.commentedConsole.length}`);
  console.log(`📋 console.log occurrences: ${ISSUES.consoleLog.length}\n`);

  if (ISSUES.emptyCatch.length > 0) {
    console.log('⚠️  Empty catch blocks (critical):\n');
    ISSUES.emptyCatch.slice(0, 10).forEach(({ file, line, code }) => {
      console.log(`   ${file}:${line} - ${code.substring(0, 60)}...`);
    });
    if (ISSUES.emptyCatch.length > 10) {
      console.log(`   ... and ${ISSUES.emptyCatch.length - 10} more`);
    }
    console.log('');
  }

  if (ISSUES.commentedConsole.length > 0) {
    console.log('📝 Commented console statements:\n');
    ISSUES.commentedConsole.slice(0, 5).forEach(({ file, line, code }) => {
      console.log(`   ${file}:${line} - ${code.substring(0, 60)}...`);
    });
    if (ISSUES.commentedConsole.length > 5) {
      console.log(`   ... and ${ISSUES.commentedConsole.length - 5} more`);
    }
    console.log('');
  }
  if (issueCount === 0) {
    console.log('✅ No critical logging issues found!\n');
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${issueCount} issues to address.\n`);
    process.exit(1);
  }
}

main();
