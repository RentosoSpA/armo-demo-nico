# TODO: Dynamic Header Icon for Empresas

## Description

Implement dynamic header icons for every empresa in the portal. Currently, the portal shows a text-based header with the empresa name, but it should display a custom logo/icon for each empresa.

## Requirements

- Each empresa should have a custom logo/icon stored in Google Cloud Platform (GCP)
- The logo should be displayed in the portal header instead of the current text-based header
- The logo should be fetched from GCP storage based on the empresa name or ID
- Fallback to text-based header if logo is not available

## Implementation Details

- Add a `logoUrl` field to the Empresa type
- Create a service to fetch empresa logos from GCP
- Update the CustomHeader component to display the logo
- Implement proper error handling and fallback mechanisms
- Ensure logos are properly sized and styled for the header

## Files to Modify

- `src/types/empresa.ts` - Add logoUrl field
- `src/services/empresa/empresaService.ts` - Add logo fetching service
- `src/components/portal/CustomHeader.tsx` - Update to display logo
- `src/store/portalStore.ts` - Add logo state management

## Current Status

- Text-based header implemented as temporary solution
- TODO comment added in CustomHeader component
- Ready for implementation when GCP storage is configured
