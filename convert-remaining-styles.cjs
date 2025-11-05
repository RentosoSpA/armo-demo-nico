#!/usr/bin/env node
/**
 * Phase 2: Convert remaining simple inline styles
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Additional patterns for phase 2
const ADDITIONAL_PATTERNS = [
  // Color patterns
  { pattern: /style=\{\{\s*color:\s*'#888',?\s*fontSize:\s*13\s*\}\}/g, replacement: 'className="text-gray-500 text-13"' },
  { pattern: /style=\{\{\s*color:\s*'#656d76'\s*\}\}/g, replacement: 'className="text-gray-600"' },
  { pattern: /style=\{\{\s*fontSize:\s*'11px'\s*\}\}/g, replacement: 'className="text-11"' },
  { pattern: /style=\{\{\s*fontSize:\s*'12px'\s*\}\}/g, replacement: 'className="text-12"' },
  { pattern: /style=\{\{\s*fontSize:\s*'13px'\s*\}\}/g, replacement: 'className="text-13"' },
  { pattern: /style=\{\{\s*fontSize:\s*'14px'\s*\}\}/g, replacement: 'className="text-14"' },

  // Flex patterns
  { pattern: /style=\{\{\s*flex:\s*1\s*\}\}/g, replacement: 'className="flex-1"' },

  // Margin patterns
  { pattern: /style=\{\{\s*margin:\s*'0\s+0\s+12px\s+0'\s*\}\}/g, replacement: 'className="mb-12"' },
  { pattern: /style=\{\{\s*marginTop:\s*'2px'\s*\}\}/g, replacement: 'className="mt-2"' },

  // Padding patterns
  { pattern: /style=\{\{\s*padding:\s*5,?\s*height:\s*'auto',?\s*width:\s*'auto'\s*\}\}/g, replacement: 'className="p-5 h-auto w-auto"' },

  // Display patterns
  { pattern: /style=\{\{\s*display:\s*'contents'\s*\}\}/g, replacement: 'className="display-contents"' },
];

async function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  ADDITIONAL_PATTERNS.forEach(({ pattern, replacement }) => {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

async function processAllFiles() {
  console.log('Phase 2: Converting remaining simple patterns...\n');

  const { stdout } = await execPromise(
    'grep -r "style={{" src --include="*.tsx" --include="*.jsx" -l',
    { maxBuffer: 1024 * 1024 * 10 }
  );

  const files = stdout.trim().split('\n').filter(Boolean);
  let converted = 0;

  for (const file of files) {
    if (await convertFile(file)) {
      console.log(`✓ ${file}`);
      converted++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Phase 2 Complete: ${converted} files updated`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const { stdout: verifyOut } = await execPromise(
      'grep -r "style={{" src --include="*.tsx" --include="*.jsx" | wc -l'
    );
    console.log(`Remaining inline styles: ${verifyOut.trim()}`);
  } catch (e) {
    console.log('Remaining inline styles: 0');
  }
}

processAllFiles().catch(console.error);
