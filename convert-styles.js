const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common inline style to className mappings
const styleReplacements = [
  // Width
  { pattern: /style=\{\{\s*width:\s*['"]100%['"]\s*\}\}/g, replacement: 'className="w-full"' },

  // Display & Flex
  { pattern: /style=\{\{\s*display:\s*['"]flex['"]\s*\}\}/g, replacement: 'className="d-flex"' },
  { pattern: /style=\{\{\s*display:\s*['"]flex['"],\s*flexDirection:\s*['"]column['"]\s*\}\}/g, replacement: 'className="d-flex flex-column"' },
  { pattern: /style=\{\{\s*display:\s*['"]flex['"],\s*gap:\s*['"]16px['"]\s*\}\}/g, replacement: 'className="d-flex gap-16"' },
  { pattern: /style=\{\{\s*display:\s*['"]flex['"],\s*gap:\s*['"]24px['"]\s*\}\}/g, replacement: 'className="d-flex gap-24"' },
  { pattern: /style=\{\{\s*display:\s*['"]flex['"],\s*justifyContent:\s*['"]center['"]\s*\}\}/g, replacement: 'className="d-flex justify-center"' },
  { pattern: /style=\{\{\s*display:\s*['"]flex['"],\s*alignItems:\s*['"]center['"]\s*\}\}/g, replacement: 'className="d-flex items-center"' },

  // Gap
  { pattern: /style=\{\{\s*gap:\s*['"]8px['"]\s*\}\}/g, replacement: 'className="gap-8"' },
  { pattern: /style=\{\{\s*gap:\s*['"]12px['"]\s*\}\}/g, replacement: 'className="gap-12"' },
  { pattern: /style=\{\{\s*gap:\s*['"]16px['"]\s*\}\}/g, replacement: 'className="gap-16"' },
  { pattern: /style=\{\{\s*gap:\s*['"]20px['"]\s*\}\}/g, replacement: 'className="gap-20"' },
  { pattern: /style=\{\{\s*gap:\s*['"]24px['"]\s*\}\}/g, replacement: 'className="gap-24"' },

  // Margins
  { pattern: /style=\{\{\s*marginBottom:\s*24\s*\}\}/g, replacement: 'className="mb-24"' },
  { pattern: /style=\{\{\s*marginBottom:\s*16\s*\}\}/g, replacement: 'className="mb-16"' },
  { pattern: /style=\{\{\s*marginBottom:\s*12\s*\}\}/g, replacement: 'className="mb-12"' },
  { pattern: /style=\{\{\s*marginBottom:\s*8\s*\}\}/g, replacement: 'className="mb-8"' },
  { pattern: /style=\{\{\s*marginTop:\s*24\s*\}\}/g, replacement: 'className="mt-24"' },
  { pattern: /style=\{\{\s*marginTop:\s*16\s*\}\}/g, replacement: 'className="mt-16"' },
  { pattern: /style=\{\{\s*marginTop:\s*12\s*\}\}/g, replacement: 'className="mt-12"' },
  { pattern: /style=\{\{\s*marginTop:\s*8\s*\}\}/g, replacement: 'className="mt-8"' },
  { pattern: /style=\{\{\s*marginRight:\s*16\s*\}\}/g, replacement: 'className="mr-16"' },
  { pattern: /style=\{\{\s*marginRight:\s*8\s*\}\}/g, replacement: 'className="mr-8"' },

  // Padding
  { pattern: /style=\{\{\s*padding:\s*['"]24px['"]\s*\}\}/g, replacement: 'className="p-24"' },
  { pattern: /style=\{\{\s*padding:\s*['"]16px['"]\s*\}\}/g, replacement: 'className="p-16"' },
  { pattern: /style=\{\{\s*padding:\s*['"]12px['"]\s*\}\}/g, replacement: 'className="p-12"' },

  // Text
  { pattern: /style=\{\{\s*textAlign:\s*['"]center['"]\s*\}\}/g, replacement: 'className="text-center"' },
  { pattern: /style=\{\{\s*textAlign:\s*['"]right['"]\s*\}\}/g, replacement: 'className="text-right"' },
  { pattern: /style=\{\{\s*textAlign:\s*['"]left['"]\s*\}\}/g, replacement: 'className="text-left"' },
  { pattern: /style=\{\{\s*color:\s*['"]#ffffff['"]\s*\}\}/g, replacement: 'className="text-white"' },
  { pattern: /style=\{\{\s*color:\s*['"]#9CA3AF['"]\s*\}\}/g, replacement: 'className="text-gray"' },
];

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  styleReplacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Converted: ${path.basename(filePath)}`);
    return true;
  }

  return false;
}

// Find all TSX files
const srcPath = path.join(__dirname, 'src');
const files = glob.sync('**/*.tsx', { cwd: srcPath, absolute: true });

console.log(`Found ${files.length} TSX files`);
console.log('Converting common inline style patterns...\n');

let convertedCount = 0;
files.forEach(file => {
  if (convertFile(file)) {
    convertedCount++;
  }
});

console.log(`\nConverted ${convertedCount} files`);
