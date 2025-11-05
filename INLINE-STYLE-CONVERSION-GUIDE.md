# Inline Style to SCSS Conversion Guide

## Progress
- **Completed**: 1/112 files
  - ✅ AgregarPropiedadForm.tsx (55 occurrences → 0)

- **Remaining**: 111 files with ~841 inline style occurrences

## Common Pattern Replacements

### Width & Height
```tsx
// Before
style={{ width: '100%' }}
// After
className="w-full"

// Before
style={{ width: 'auto' }}
// After
className="w-auto"
```

### Display & Flex
```tsx
// Before
style={{ display: 'flex' }}
// After
className="d-flex"

// Before
style={{ display: 'flex', flexDirection: 'column' }}
// After
className="d-flex flex-column"

// Before
style={{ display: 'flex', gap: '16px' }}
// After
className="d-flex gap-16"

// Before
style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
// After
className="d-flex justify-center items-center"
```

### Spacing (Margin & Padding)
```tsx
// Margin
style={{ marginBottom: 24 }} → className="mb-24"
style={{ marginTop: 16 }} → className="mt-16"
style={{ margin: '24px' }} → className="m-24"

// Padding
style={{ padding: '24px' }} → className="p-24"
style={{ paddingTop: 16 }} → className="pt-16"
```

### Text Alignment & Colors
```tsx
// Alignment
style={{ textAlign: 'center' }} → className="text-center"
style={{ textAlign: 'right' }} → className="text-right"

// Colors
style={{ color: '#ffffff' }} → className="text-white"
style={{ color: '#9CA3AF' }} → className="text-gray"
```

## Component-Specific SCSS Files Created

1. **_property-forms.scss** - For property form components
   - Classes: `property-form__*`
   - Used in: AgregarPropiedadForm.tsx, FormPropiedad.tsx, EditPropiedadModal.tsx, etc.

2. **_evaluacion-dashboard.scss** - For evaluation dashboard
   - Classes: `evaluation-dashboard__*`
   - Used in: EvaluacionDashboard.tsx

## Conversion Steps for Each File

1. **Read the file** to understand the inline styles
2. **Identify patterns**:
   - Simple utility class replacements (use existing utilities)
   - Complex component-specific styles (create new SCSS file if needed)
3. **Create SCSS file** (if needed) in `src/styles/components/`
4. **Import SCSS** at top of component file
5. **Replace inline styles** with className
6. **Test** to ensure styles still work

## High-Priority Files (by occurrence count)

1. ~~AgregarPropiedadForm.tsx - 55~~ ✅
2. EvaluacionDashboard.tsx - 53
3. FormPropiedad.tsx - 47
4. AgregarPropiedadModal.tsx - 30
5. EditPropiedadModal.tsx - 29
6. VisitasSidebar.tsx - 28
7. PropertyCard.tsx (portal) - 27
8. RolesyAccesos.tsx - 27
9. OsoDrawers.tsx - 24
10. OportunidadesKanban.tsx - 21

## Available Utility Classes

### Spacing (_spacing.scss)
- Margins: `.m-{0,4,8,12,16,20,24,32,48}`
- Margin directional: `.mt-*`, `.mb-*`, `.ml-*`, `.mr-*`
- Padding: `.p-{0,4,8,12,16,20,24,32}`
- Padding directional: `.pt-*`, `.pb-*`, `.pl-*`, `.pr-*`

### Layout (_layout.scss)
- Display: `.d-{none,block,flex,grid}`
- Flex: `.flex-{row,column,wrap,1}`
- Justify: `.justify-{start,end,center,between,around}`
- Align: `.items-{start,end,center,stretch}`
- Gap: `.gap-{0,4,6,8,10,12,16,20,24,32}`
- Width: `.w-{full,auto,screen}`
- Height: `.h-{full,auto,screen}`

### Typography (_typography.scss)
- Alignment: `.text-{left,center,right}`
- Size: `.text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl}`
- Weight: `.font-{light,normal,medium,semibold,bold}`
- Colors: `.text-white`, `.text-gray`, `.text-muted`

## Notes
- Never use `!important` declarations
- Prefer utility classes for simple styles
- Create component-specific SCSS for complex/repeated patterns
- Always import SCSS files at component level
