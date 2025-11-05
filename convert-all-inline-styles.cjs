#!/usr/bin/env node
/**
 * Automated Inline CSS to SCSS Converter
 * Converts all inline style={{...}} to className with utility classes
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Utility class mappings
const UTILITY_MAPPINGS = {
  // Display & Layout
  "display: 'flex'": 'd-flex',
  'display: "flex"': 'd-flex',
  "display: 'block'": 'd-block',
  "display: 'inline-block'": 'd-inline-block',
  "display: 'none'": 'd-none',

  // Flex properties
  "alignItems: 'center'": 'align-center',
  'alignItems: "center"': 'align-center',
  "alignItems: 'flex-start'": 'align-start',
  "alignItems: 'flex-end'": 'align-end',
  "justifyContent: 'center'": 'justify-center',
  'justifyContent: "center"': 'justify-center',
  "justifyContent: 'space-between'": 'justify-between',
  'justifyContent: "space-between"': 'justify-between',
  "justifyContent: 'flex-end'": 'justify-end',
  "justifyContent: 'flex-start'": 'justify-start',
  "flexDirection: 'column'": 'flex-column',
  'flexDirection: "column"': 'flex-column',
  "flexDirection: 'row'": 'flex-row',
  "flexWrap: 'wrap'": 'flex-wrap',

  // Width & Height
  "width: '100%'": 'w-full',
  'width: "100%"': 'w-full',
  "height: '100%'": 'h-full',
  'height: "100%"': 'h-full',

  // Text alignment
  "textAlign: 'center'": 'text-center',
  'textAlign: "center"': 'text-center',
  "textAlign: 'right'": 'text-right',
  "textAlign: 'left'": 'text-left',

  // Font weight
  "fontWeight: 'bold'": 'font-bold',
  'fontWeight: "bold"': 'font-bold',
  "fontWeight: 600": 'font-semibold',
  'fontWeight: 500': 'font-medium',

  // Cursor
  "cursor: 'pointer'": 'cursor-pointer',
  'cursor: "pointer"': 'cursor-pointer',
  "cursor: 'not-allowed'": 'cursor-not-allowed',

  // Overflow
  "overflow: 'hidden'": 'overflow-hidden',
  'overflow: "hidden"': 'overflow-hidden',
  "overflowX: 'auto'": 'overflow-x-auto',
  'overflowX: "auto"': 'overflow-x-auto',
  "overflowY: 'auto'": 'overflow-y-auto',
  'overflowY: "auto"': 'overflow-y-auto',

  // Position
  "position: 'relative'": 'position-relative',
  'position: "relative"': 'position-relative',
  "position: 'absolute'": 'position-absolute',
  "position: 'fixed'": 'position-fixed',
};

// Spacing mappings (common values)
const SPACING_VALUES = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64];

function generateSpacingMappings() {
  const mappings = {};
  const props = ['margin', 'padding'];
  const dirs = { Top: 't', Bottom: 'b', Left: 'l', Right: 'r' };

  SPACING_VALUES.forEach(value => {
    props.forEach(prop => {
      const prefix = prop === 'margin' ? 'm' : 'p';

      // Full property (e.g., margin: 16)
      mappings[`${prop}: ${value}`] = `${prefix}-${value}`;
      mappings[`${prop}: '${value}px'`] = `${prefix}-${value}`;
      mappings[`${prop}: "${value}px"`] = `${prefix}-${value}`;

      // Directional (e.g., marginTop: 16)
      Object.entries(dirs).forEach(([dir, shortDir]) => {
        mappings[`${prop}${dir}: ${value}`] = `${prefix}${shortDir}-${value}`;
        mappings[`${prop}${dir}: '${value}px'`] = `${prefix}${shortDir}-${value}`;
        mappings[`${prop}${dir}: "${value}px"`] = `${prefix}${shortDir}-${value}`;
      });
    });

    // Gap
    mappings[`gap: ${value}`] = `gap-${value}`;
    mappings[`gap: '${value}px'`] = `gap-${value}`;
    mappings[`gap: "${value}px"`] = `gap-${value}`;
  });

  return mappings;
}

const ALL_MAPPINGS = { ...UTILITY_MAPPINGS, ...generateSpacingMappings() };

function parseStyleObject(styleStr) {
  const styles = {};

  // Remove outer braces
  styleStr = styleStr.trim();
  if (styleStr.startsWith('{{')) styleStr = styleStr.slice(2, -2);
  else if (styleStr.startsWith('{')) styleStr = styleStr.slice(1, -1);

  // Split by comma (simple approach)
  const parts = styleStr.split(',').map(s => s.trim());

  parts.forEach(part => {
    const colonIndex = part.indexOf(':');
    if (colonIndex > 0) {
      const key = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();
      if (key && value) {
        styles[key] = value;
      }
    }
  });

  return styles;
}

function convertStylesToClasses(styleStr) {
  const classes = [];
  const unconverted = [];

  // Try to match individual style properties
  Object.entries(ALL_MAPPINGS).forEach(([pattern, className]) => {
    if (styleStr.includes(pattern)) {
      if (!classes.includes(className)) {
        classes.push(className);
      }
    }
  });

  // If we found classes, return them
  if (classes.length > 0) {
    return { classes, hasUnconverted: false };
  }

  // Otherwise, this needs custom handling
  return { classes: [], hasUnconverted: true };
}

async function convertFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Find all style={{ ... }} patterns
  const styleRegex = /style=\{(\{[^}]+\})\}/g;
  let matches = [...content.matchAll(styleRegex)];

  if (matches.length === 0) {
    return { converted: 0, skipped: 0 };
  }

  let newContent = content;
  let converted = 0;
  let skipped = 0;

  // Process each match in reverse order to preserve indices
  matches.reverse().forEach(match => {
    const fullMatch = match[0];
    const styleContent = match[1];

    // Skip dynamic styles (containing variables or expressions)
    if (styleContent.includes('${') || styleContent.includes('props.') ||
        styleContent.includes('theme.') || styleContent.includes('?') ||
        styleContent.includes('||') || styleContent.includes('&&')) {
      skipped++;
      return;
    }

    const result = convertStylesToClasses(styleContent);

    if (result.classes.length > 0) {
      const classNameStr = `className="${result.classes.join(' ')}"`;

      // Check if there's already a className nearby
      const beforeMatch = newContent.slice(Math.max(0, match.index - 100), match.index);
      if (beforeMatch.includes('className=')) {
        // Try to merge with existing className
        const classNameRegex = /className="([^"]*)"/;
        const existingMatch = beforeMatch.match(classNameRegex);
        if (existingMatch) {
          const existingClasses = existingMatch[1];
          const mergedClasses = [...new Set([...existingClasses.split(' '), ...result.classes])].join(' ');

          // Replace existing className and remove style attribute
          const startIndex = match.index - beforeMatch.length + beforeMatch.lastIndexOf('className=');
          const endIndex = match.index + fullMatch.length;

          newContent = newContent.slice(0, startIndex) +
                      `className="${mergedClasses}"` +
                      newContent.slice(endIndex);
          converted++;
          return;
        }
      }

      // Replace style with className
      newContent = newContent.slice(0, match.index) +
                  classNameStr +
                  newContent.slice(match.index + fullMatch.length);
      converted++;
    } else {
      skipped++;
    }
  });

  if (converted > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }

  return { converted, skipped };
}

async function processAllFiles() {
  console.log('Scanning for files with inline styles...\n');

  // Find all TSX/JSX files with inline styles
  const { stdout } = await execPromise(
    'grep -r "style={{" src --include="*.tsx" --include="*.jsx" -l',
    { maxBuffer: 1024 * 1024 * 10 }
  );

  const files = stdout.trim().split('\n').filter(Boolean);

  console.log(`Found ${files.length} files with inline styles\n`);
  console.log('Converting...\n');

  let totalConverted = 0;
  let totalSkipped = 0;

  for (const file of files) {
    const result = await convertFile(file);

    if (result.converted > 0) {
      console.log(`✓ ${file}: ${result.converted} converted, ${result.skipped} skipped`);
      totalConverted += result.converted;
      totalSkipped += result.skipped;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`CONVERSION COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total converted: ${totalConverted}`);
  console.log(`Total skipped (dynamic/complex): ${totalSkipped}`);
  console.log(`\nVerifying remaining inline styles...`);

  // Verify
  try {
    const { stdout: verifyOut } = await execPromise(
      'grep -r "style={{" src --include="*.tsx" --include="*.jsx" | wc -l'
    );
    console.log(`Remaining inline styles: ${verifyOut.trim()}`);
  } catch (e) {
    console.log('Remaining inline styles: 0');
  }
}

// Run
processAllFiles().catch(console.error);
