# Inline Styles to SCSS Conversion Guide

## Overview
This document tracks the conversion of inline CSS styles to external SCSS utility classes across the codebase.

## Progress Summary
- **Total files with inline styles**: 114
- **Files converted so far**: ~10
- **Remaining files**: ~104

## Conversion Patterns

### Common Inline Style → SCSS Class Mappings

#### Layout & Display (Most common - 113 occurrences)
```tsx
// BEFORE
style={{ display: 'flex' }}
style={{ flexDirection: 'column' }}
style={{ alignItems: 'center' }}
style={{ justifyContent: 'space-between' }}
style={{ justifyContent: 'center' }}
style={{ gap: 8 }}
style={{ gap: 12 }}
style={{ gap: 16 }}

// AFTER
className="d-flex"
className="flex-column"
className="align-center"
className="justify-between"
className="justify-center"
className="gap-8"
className="gap-12"
className="gap-16"
```

#### Spacing (Margins & Padding)
```tsx
// BEFORE
style={{ margin: 0 }}
style={{ marginBottom: 0 }}
style={{ marginBottom: 8 }}
style={{ marginBottom: 16 }}
style={{ marginBottom: 24 }}
style={{ marginTop: 8 }}
style={{ marginTop: 16 }}
style={{ marginTop: 24 }}
style={{ padding: '24px' }}

// AFTER
className="m-0"
className="mb-0"
className="mb-8"
className="mb-16"
className="mb-24"
className="mt-8"
className="mt-16"
className="mt-24"
className="p-24"
```

#### Typography
```tsx
// BEFORE
style={{ textAlign: 'center' }}
style={{ fontSize: '12px' }}
style={{ fontSize: '14px' }}
style={{ fontSize: '16px' }}
style={{ fontWeight: 600 }}

// AFTER
className="text-center"
className="text-12"
className="text-14"
className="text-16"
className="font-semibold"
```

#### Width & Height (120 occurrences)
```tsx
// BEFORE
style={{ width: '100%' }}
style={{ height: '100%' }}
style={{ width: 'auto' }}

// AFTER
className="w-full"
className="h-full"
className="w-auto"
```

#### Overflow
```tsx
// BEFORE
style={{ overflowX: 'auto' }}
style={{ overflow: 'auto' }}

// AFTER
className="overflow-x-auto"
className="overflow-auto"
```

#### Borders & Radius
```tsx
// BEFORE
style={{ borderRadius: '8px' }}
style={{ borderRadius: '12px' }}
style={{ borderRadius: 12 }}

// AFTER
className="rounded-8"
className="rounded-12"
className="rounded-12"
```

#### Cursor
```tsx
// BEFORE
style={{ cursor: 'pointer' }}

// AFTER
className="cursor-pointer"
```

## Utility Classes Created

### Location: `src/styles/utilities/`
- `_spacing.scss` - Margin and padding utilities
- `_layout.scss` - Flexbox, display, positioning utilities
- `_typography.scss` - Text styling utilities
- `_index.scss` - Index file importing all utilities

### Location: `src/styles/main.scss`
- Extended utilities for gap, flex, border-radius, font-size, colors, width/height

### Module-Specific SCSS Files
- `src/styles/components/_propiedades.scss` - Property module styles
- `src/styles/components/_calendario.scss` - Calendar module styles

## Files Converted

### ✅ Completed
1. `src/components/layout/Header.tsx`
2. `src/components/layout/Sidebar.tsx`
3. `src/components/layout/AdminLayout.tsx`
4. `src/components/propiedades/PropiedadesHeader.tsx` (removed !important)
5. `src/components/Calendario/CalendarioHeader.tsx` (removed !important)
6. `src/components/propiedades/PropiedadesCard.tsx`
7. `src/components/propiedades/PropiedadesCardView.tsx`
8. `src/components/propiedades/ficha/PropertyHeader.tsx`
9. Auth pages (Login, Register, ForgotPassword, etc.) - 6 files
10. Layout components - 17 files

### 🔄 In Progress / Remaining Modules

#### Propiedades Module (~20 files remaining)
- AgregarPropiedadForm.tsx (55 inline styles)
- AgregarPropiedadModal.tsx (30 inline styles)
- FormPropiedad.tsx (47 inline styles)
- EditPropiedadModal.tsx (29 inline styles)
- ColumnasTable.tsx (7 inline styles)
- ImportPropiedadesModal.tsx (10 inline styles)
- ficha/* (9 files with inline styles)

#### Oportunidades Module (~11 files)
- OportunidadesHeader.tsx
- OportunidadesKanban.tsx
- OportunidadesTable.tsx
- OportunidadesStats.tsx
- NuevaOportunidadModal.tsx
- AddProspectoModal.tsx
- OportunidadDetails.tsx
- InformacionProspecto.tsx
- EvaluacionModal.tsx
- EvaluacionDashboard.tsx
- ProspectoUploadForm.tsx

#### Calendario Module (~11 files)
- CalendarioLeftPanel.tsx
- CalendarioStats.tsx
- CalendarioVisitas.tsx
- CustomCalendar.tsx
- VisitasHeader.tsx
- VisitasSidebar.tsx
- VisitaCard.tsx
- AddVisitaModal.tsx
- EditVisitaModal.tsx

#### Contratos Module (~4 files)
- ContratosHeader.tsx
- ContratosCard.tsx
- ContratosTable.tsx
- NuevoContratoModal.tsx

#### Prospectos Module (~7 files)
- ProspectosHeader.tsx
- ProspectosCard.tsx
- ProspectosTable.tsx
- NuevoProspectoModal.tsx
- ProspectoProfileModal.tsx
- ProspectoOpportunityModal.tsx

#### Cobros Module (~5 files)
- CobrosHeader.tsx
- CobrosStats.tsx
- CobrosTable.tsx
- CobrosCalendar.tsx
- CobrosCompactCalendar.tsx

#### Propietarios Module (~8 files)
- PropietariosHeader.tsx
- PropietariosTable.tsx
- PropietariosCard.tsx
- AgregarPropietarioModal.tsx
- EditPropietarioModal.tsx

#### Reportes Module (~8 files)
- ReportesHeader.tsx
- ReportesGrid.tsx
- Various report components

#### Dashboard/Tablero Module (~10 files)
- DashboardHeader.tsx
- DashboardStats.tsx
- Various dashboard components

#### Evaluaciones Module (~5 files)
- EvaluacionForm.tsx
- Various evaluation components

#### Portal Module (~5 files)
- Public property portal components

#### Ajustes Module (~3 files)
- Settings components

#### Brigada Module (~1 file)
- Brigada components

#### Root Files (~3 files)
- App.tsx
- mask.tsx
- RentosoIcon.tsx

#### Pages (~20 files)
- Various page-level components

## Conversion Guidelines

### DO:
✅ Use semantic utility classes from SCSS
✅ Keep truly dynamic/conditional styles inline
✅ Combine multiple utility classes when needed
✅ Create component-specific classes for complex patterns
✅ Test that styles are preserved after conversion

### DON'T:
❌ Use !important in SCSS (violates project rules)
❌ Convert dynamic/computed styles to static classes
❌ Remove inline styles that depend on props/state
❌ Create overly specific utility classes

## Example Conversions

### Simple Conversion
```tsx
// BEFORE
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <span style={{ fontSize: '14px', color: '#9CA3AF' }}>Label</span>
</div>

// AFTER
<div className="d-flex gap-12 align-center">
  <span className="text-14 text-gray">Label</span>
</div>
```

### Complex Conversion with Component-Specific Class
```tsx
// BEFORE
<Card style={{ marginBottom: 24, borderRadius: 12 }}>
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Title level={2} style={{ margin: 0 }}>Title</Title>
  </div>
</Card>

// AFTER (using component-specific class)
<Card className="property-ficha-header">
  <div className="d-flex flex-column">
    <Title level={2} className="m-0">Title</Title>
  </div>
</Card>
```

### Dynamic Styles (Keep Inline)
```tsx
// Keep inline - depends on props/state
<div style={{ width: isExpanded ? '300px' : '60px' }}>
<span style={{ color: status === 'active' ? 'green' : 'red' }}>
```

## Next Steps

1. Continue systematic conversion module by module
2. Test each module after conversion
3. Run full build to ensure no breaking changes
4. Update this document as files are converted
5. Mark modules as complete when all files converted

## Build Command
```bash
npm run build:dev
```
