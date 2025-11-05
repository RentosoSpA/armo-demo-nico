#!/usr/bin/env python3
"""
Script to convert common inline styles to SCSS utility classes.
This helps identify patterns and suggests replacements.
"""

import re
import os
from pathlib import Path
from collections import defaultdict

# Common style-to-class mappings
STYLE_MAPPINGS = {
    # Margin
    r'margin:\s*0': 'm-0',
    r'marginBottom:\s*0': 'mb-0',
    r'marginBottom:\s*8': 'mb-8',
    r'marginBottom:\s*12': 'mb-12',
    r'marginBottom:\s*16': 'mb-16',
    r'marginBottom:\s*24': 'mb-24',
    r'marginTop:\s*0': 'mt-0',
    r'marginTop:\s*8': 'mt-8',
    r'marginTop:\s*16': 'mt-16',
    r'marginTop:\s*24': 'mt-24',

    # Display
    r'display:\s*[\'"]flex[\'"]': 'd-flex',
    r'flexDirection:\s*[\'"]column[\'"]': 'flex-column',
    r'alignItems:\s*[\'"]center[\'"]': 'align-center',
    r'justifyContent:\s*[\'"]space-between[\'"]': 'justify-between',
    r'justifyContent:\s*[\'"]center[\'"]': 'justify-center',

    # Gaps
    r'gap:\s*8': 'gap-8',
    r'gap:\s*12': 'gap-12',
    r'gap:\s*16': 'gap-16',

    # Text
    r'textAlign:\s*[\'"]center[\'"]': 'text-center',
    r'fontSize:\s*16': 'text-16',

    # Overflow
    r'overflowX:\s*[\'"]auto[\'"]': 'overflow-x-auto',
    r'overflow:\s*[\'"]auto[\'"]': 'overflow-auto',

    # Border radius
    r'borderRadius:\s*12': 'rounded-12',

    # Width
    r'width:\s*[\'"]100%[\'"]': 'w-full',
    r'height:\s*[\'"]100%[\'"]': 'h-full',

    # Cursor
    r'cursor:\s*[\'"]pointer[\'"]': 'cursor-pointer',
}

def find_inline_styles(file_path):
    """Find all inline style occurrences in a file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all style={{ ... }} patterns
    style_pattern = r'style=\{\{([^}]+)\}\}'
    matches = re.findall(style_pattern, content)

    return matches

def analyze_styles(src_dir):
    """Analyze all TSX files and categorize inline styles."""
    style_usage = defaultdict(int)
    files_with_styles = []

    for tsx_file in Path(src_dir).rglob('*.tsx'):
        styles = find_inline_styles(tsx_file)
        if styles:
            files_with_styles.append(str(tsx_file))
            for style in styles:
                # Extract individual style properties
                props = re.findall(r'(\w+):\s*([^,}]+)', style)
                for prop, value in props:
                    key = f"{prop}: {value.strip()}"
                    style_usage[key] += 1

    return style_usage, files_with_styles

if __name__ == '__main__':
    src_dir = 'src'
    print("Analyzing inline styles in TSX files...\n")

    style_usage, files_with_styles = analyze_styles(src_dir)

    print(f"Found {len(files_with_styles)} files with inline styles\n")
    print("Top 30 most common inline styles:")
    print("-" * 60)

    sorted_styles = sorted(style_usage.items(), key=lambda x: x[1], reverse=True)
    for style, count in sorted_styles[:30]:
        print(f"{count:3d}x  {style}")

    print("\n" + "=" * 60)
    print("\nFiles with inline styles:")
    print("-" * 60)
    for f in sorted(files_with_styles):
        print(f)
