# Quick Conversion Reference Card

## Most Common Inline Style Replacements

### Layout & Flexbox (Most Frequent)

| Inline Style | Utility Class | Usage Count |
|--------------|---------------|-------------|
| `display: 'flex'` | `d-flex` | 113× |
| `flexDirection: 'column'` | `flex-column` | 15× |
| `alignItems: 'center'` | `align-center` | 75× |
| `justifyContent: 'space-between'` | `justify-between` | 30× |
| `justifyContent: 'center'` | `justify-center` | 23× |
| `flex: 1` | `flex-1` | 16× |

### Spacing

| Inline Style | Utility Class | Usage Count |
|--------------|---------------|-------------|
| `margin: 0` | `m-0` | 28× |
| `marginBottom: 0` | `mb-0` | 26× |
| `marginBottom: 8` | `mb-8` | 16× |
| `marginBottom: 16` | `mb-16` | 63× |
| `marginBottom: 24` | `mb-24` | 36× |
| `marginTop: 8` | `mt-8` | 15× |
| `marginTop: 16` | `mt-16` | 16× |
| `marginTop: 24` | `mt-24` | 14× |
| `padding: '24px'` | `p-24` | 20× |

### Gaps

| Inline Style | Utility Class |
|--------------|---------------|
| `gap: 4` | `gap-4` |
| `gap: 6` | `gap-6` |
| `gap: 8` | `gap-8` |
| `gap: 10` | `gap-10` |
| `gap: 12` | `gap-12` |
| `gap: 16` | `gap-16` |

### Dimensions

| Inline Style | Utility Class | Usage Count |
|--------------|---------------|-------------|
| `width: '100%'` | `w-full` | 120× |
| `height: '100%'` | `h-full` | - |
| `width: 'auto'` | `w-auto` | - |
| `width: 160` | `w-160` | - |
| `width: 300` | `w-280` or custom | - |

### Typography

| Inline Style | Utility Class | Usage Count |
|--------------|---------------|-------------|
| `textAlign: 'center'` | `text-center` | 56× |
| `fontSize: '12px'` | `text-12` | 40× |
| `fontSize: '14px'` | `text-14` | 30× |
| `fontSize: '16px'` | `text-16` | - |
| `fontWeight: 600` | `font-semibold` | 19× |
| `cursor: 'pointer'` | `cursor-pointer` | 15× |

### Border & Radius

| Inline Style | Utility Class | Usage Count |
|--------------|---------------|-------------|
| `borderRadius: '8px'` or `8` | `rounded-8` | 16× |
| `borderRadius: '12px'` or `12` | `rounded-12` | 29× |
| `borderRadius: '16px'` | `rounded-16` | - |

### Overflow

| Inline Style | Utility Class |
|--------------|---------------|
| `overflow: 'auto'` | `overflow-auto` |
| `overflowX: 'auto'` | `overflow-x-auto` |
| `overflowY: 'auto'` | `overflow-y-auto` |
| `overflow: 'hidden'` | `overflow-hidden` |

### Display

| Inline Style | Utility Class |
|--------------|---------------|
| `display: 'block'` | `d-block` |
| `display: 'none'` | `d-none` |
| `display: 'inline'` | `d-inline` |
| `display: 'inline-block'` | `d-inline-block` |

## Quick Conversion Examples

### Before → After

```tsx
// FLEXBOX LAYOUT (Most Common Pattern)
❌ style={{ display: 'flex', alignItems: 'center', gap: 12 }}
✅ className="d-flex align-center gap-12"

// MARGINS
❌ style={{ marginBottom: 24 }}
✅ className="mb-24"

❌ style={{ marginTop: 16, marginBottom: 8 }}
✅ className="mt-16 mb-8"

// FULL WIDTH
❌ style={{ width: '100%' }}
✅ className="w-full"

// TEXT ALIGNMENT
❌ style={{ textAlign: 'center', fontSize: '14px' }}
✅ className="text-center text-14"

// COMBINED
❌ style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}
✅ className="d-flex justify-between mb-24"

// OVERFLOW
❌ style={{ overflowX: 'auto' }}
✅ className="overflow-x-auto"

// CURSOR
❌ style={{ cursor: 'pointer' }}
✅ className="cursor-pointer"
```

## Module-Specific Patterns

### When to Use Component SCSS vs Utilities

**Use Utilities** ✅ for:
- Common layout patterns
- Standard spacing
- Basic typography
- Simple styling

**Use Component SCSS** ✅ for:
- Complex button states
- Module-specific colors
- Hover/active states
- Repeated patterns within module

**Keep Inline** ✅ for:
- Dynamic values from props
- Conditional styling based on state
- Computed values
- One-off unique styles

## Quick Workflow

### 1. Analyze File
```bash
grep "style={{" path/to/file.tsx
```

### 2. Check Module SCSS
- Does `src/styles/components/_modulename.scss` exist?
- If not, create it

### 3. Convert Patterns
- Common → utilities
- Module-specific → component SCSS
- Dynamic → keep inline

### 4. Import SCSS
```tsx
import '../../styles/components/_modulename.scss';
```

### 5. Test
```bash
npm run build:dev
```

## Available Utility Classes

### Spacing
`m-{0,4,8,12,16,20,24,32,48}` - margin
`mt-`, `mb-`, `ml-`, `mr-` - directional margins
`p-{0,4,8,12,16,20,24,32}` - padding
`pt-`, `pb-`, `pl-`, `pr-` - directional padding

### Layout
`d-{flex,block,inline,inline-block,none,grid}`
`flex-{row,column,1}`
`justify-{start,end,center,between,around,evenly}`
`align-{start,end,center,baseline,stretch}` (use as `align-center` for items)
`gap-{4,6,8,10,12,16,20,24,32}`

### Dimensions
`w-{full,auto,160,200,240,280}`
`h-{full,auto}`

### Typography
`text-{12,14,16,18,24,32,48}` - font size
`text-{center,left,right}` - alignment
`font-{normal,medium,semibold,bold}` - weight
`cursor-{pointer,default,not-allowed}`

### Overflow
`overflow-{auto,hidden,visible,scroll}`
`overflow-x-{auto,hidden,scroll}`
`overflow-y-{auto,hidden,scroll}`

### Border Radius
`rounded-{8,12,16}`
`rounded` - 6px
`rounded-lg` - 12px
`rounded-full` - 50%

## Common Module Imports

```tsx
// Propiedades
import '../../styles/components/_propiedades.scss';

// Oportunidades
import '../../styles/components/_oportunidades.scss';

// Calendario
import '../../styles/components/_calendario.scss';

// (Create others as needed)
```

## DO's and DON'Ts

### ✅ DO:
- Use utility classes for common patterns
- Combine multiple utilities
- Create module SCSS for complex patterns
- Keep dynamic styles inline
- Test after conversion
- Follow NO !important rule

### ❌ DON'T:
- Use !important in SCSS
- Convert dynamic/computed styles
- Create overly specific utilities
- Remove conditional inline styles
- Skip build verification

## Files to Reference

- **Full Guide**: `INLINE_STYLES_CONVERSION.md`
- **Examples**:
  - `src/components/propiedades/PropiedadesHeader.tsx`
  - `src/components/propiedades/PropiedadesCardView.tsx`
  - `src/components/Oportunidades/OportunidadesHeader.tsx`
- **Utilities**: `src/styles/utilities/`
- **Module SCSS**: `src/styles/components/`

## Analysis Command

```bash
# See all inline styles in a file
grep -n "style={{" path/to/file.tsx

# Count inline styles
grep -c "style={{" path/to/file.tsx

# List all files with inline styles
find src -name "*.tsx" -exec grep -l "style={{" {} \;

# Run full analysis
python convert_inline_styles.py
```

---
*Quick reference for inline CSS to SCSS conversion*
*Always verify with: `npm run build:dev`*
