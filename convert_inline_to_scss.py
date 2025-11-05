#!/usr/bin/env python3
"""
Automated Inline CSS to SCSS Converter
Converts inline style={{...}} to className with SCSS files
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

# Common style to utility class mappings
UTILITY_MAPPINGS = {
    # Display & Layout
    "display: 'flex'": "d-flex",
    "display: 'block'": "d-block",
    "display: 'inline-block'": "d-inline-block",
    "display: 'none'": "d-none",

    # Flex properties
    "alignItems: 'center'": "align-center",
    "alignItems: 'flex-start'": "align-start",
    "alignItems: 'flex-end'": "align-end",
    "justifyContent: 'center'": "justify-center",
    "justifyContent: 'space-between'": "justify-between",
    "justifyContent: 'flex-end'": "justify-end",
    "flexDirection: 'column'": "flex-column",
    "flexWrap: 'wrap'": "flex-wrap",

    # Width & Height
    "width: '100%'": "w-full",
    "height: '100%'": "h-full",

    # Text alignment
    "textAlign: 'center'": "text-center",
    "textAlign: 'right'": "text-right",
    "textAlign: 'left'": "text-left",

    # Cursor
    "cursor: 'pointer'": "cursor-pointer",
    "cursor: 'not-allowed'": "cursor-not-allowed",

    # Overflow
    "overflow: 'hidden'": "overflow-hidden",
    "overflowX: 'auto'": "overflow-x-auto",
    "overflowY: 'auto'": "overflow-y-auto",
}

# Spacing patterns (margin/padding)
SPACING_PATTERN = re.compile(r"(margin|padding)(Top|Bottom|Left|Right)?: (\d+)")

def camel_to_kebab(name):
    """Convert camelCase to kebab-case"""
    return re.sub(r'(?<!^)(?=[A-Z])', '-', name).lower()

def parse_inline_style(style_content):
    """Parse inline style object and return style properties"""
    styles = {}

    # Remove outer braces and split by comma (rough parsing)
    style_content = style_content.strip()
    if style_content.startswith('{{') and style_content.endswith('}}'):
        style_content = style_content[2:-2]
    elif style_content.startswith('{') and style_content.endswith('}'):
        style_content = style_content[1:-1]

    # Simple parsing (doesn't handle complex nested objects)
    parts = re.split(r',(?![^{]*})', style_content)

    for part in parts:
        if ':' in part:
            key_value = part.split(':', 1)
            if len(key_value) == 2:
                key = key_value[0].strip()
                value = key_value[1].strip().strip(',')
                styles[key] = value

    return styles

def convert_style_to_classes(styles):
    """Convert style object to utility classes"""
    classes = []
    remaining_styles = {}

    for key, value in styles.items():
        # Check for direct utility mapping
        mapping_key = f"{key}: {value}"
        if mapping_key in UTILITY_MAPPINGS:
            classes.append(UTILITY_MAPPINGS[mapping_key])
            continue

        # Check for spacing (margin/padding)
        spacing_match = SPACING_PATTERN.match(f"{key}: {value}")
        if spacing_match:
            prop_type = spacing_match.group(1)  # margin or padding
            direction = spacing_match.group(2)  # Top, Bottom, etc.
            size = spacing_match.group(3)

            prefix = 'm' if prop_type == 'margin' else 'p'
            if direction:
                dir_map = {'Top': 't', 'Bottom': 'b', 'Left': 'l', 'Right': 'r'}
                prefix += dir_map.get(direction, '')

            classes.append(f"{prefix}-{size}")
            continue

        # Check for gap
        if key == 'gap':
            classes.append(f"gap-{value}")
            continue

        # Style needs custom SCSS
        remaining_styles[key] = value

    return classes, remaining_styles

def find_inline_styles_in_file(file_path):
    """Find all inline style attributes in a TSX file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all style={{ ... }} patterns
    pattern = re.compile(r'style=\{(\{[^}]+\})\}', re.DOTALL)
    matches = pattern.findall(content)

    return matches, content

def convert_file(file_path, dry_run=True):
    """Convert inline styles in a file to SCSS"""
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Processing: {file_path}")

    matches, content = find_inline_styles_in_file(file_path)

    if not matches:
        print("  No inline styles found")
        return

    print(f"  Found {len(matches)} inline style occurrences")

    all_classes = []
    all_custom_styles = []

    for match in matches:
        styles = parse_inline_style(match)
        classes, custom_styles = convert_style_to_classes(styles)

        if classes:
            all_classes.extend(classes)
            print(f"    → Utility classes: {' '.join(classes)}")

        if custom_styles:
            all_custom_styles.append(custom_styles)
            print(f"    → Custom styles needed: {custom_styles}")

    if not dry_run:
        # TODO: Actually modify the file
        print("  [Would modify file here]")

    return {
        'file': file_path,
        'matches': len(matches),
        'classes': all_classes,
        'custom_styles': all_custom_styles
    }

def scan_project(src_dir='src'):
    """Scan entire project for inline styles"""
    results = []

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.jsx'):
                file_path = os.path.join(root, file)
                matches, _ = find_inline_styles_in_file(file_path)

                if matches:
                    results.append({
                        'file': file_path,
                        'count': len(matches)
                    })

    return results

if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        convert_file(file_path, dry_run=True)
    else:
        print("Scanning project for inline styles...")
        results = scan_project()

        print(f"\n{'='*60}")
        print(f"SCAN RESULTS: Found {len(results)} files with inline styles")
        print(f"{'='*60}")

        total_occurrences = sum(r['count'] for r in results)
        print(f"\nTotal inline style occurrences: {total_occurrences}")

        print("\nFiles by occurrence count:")
        sorted_results = sorted(results, key=lambda x: x['count'], reverse=True)

        for result in sorted_results[:20]:  # Show top 20
            print(f"  {result['count']:3d} - {result['file']}")

        if len(sorted_results) > 20:
            print(f"\n  ... and {len(sorted_results) - 20} more files")

        print("\n" + "="*60)
        print("To convert a specific file, run:")
        print("  python convert_inline_to_scss.py <file_path>")
