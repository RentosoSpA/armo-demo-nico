# Mock Services - Permanent Setup

This project now uses mock services for all business data while keeping Firebase authentication. The old backend has been completely replaced with mock implementations.

## What's Using Mock Data Now

All business functionality uses mock services:
- **Properties** (`propiedadesServiceMock.ts`) - Property management
- **Prospects** (`prospectosServiceMock.ts`) - Prospect management
- **Opportunities** (`oportunidadesServiceMock.ts`) - Opportunity management
- **Property Owners** (`propietariosServiceMock.ts`) - Owner management
- **Company Settings** (`empresaServiceMock.ts`) - Company configuration
- **Agents** (`agentesServiceMock.ts`) - Agent management
- **Users** (`userServiceMock.ts`) - User management
- **Visits** (`visitasServiceMock.ts`) - Visit scheduling
- **Files & Images** (`multimediaServiceMock.ts`) - File handling
- **Notifications** (`notificationsServiceMock.ts`) - Notifications
- **Dashboard Data** (`saludDataMock.ts`) - Dashboard analytics
- **Clients** (`clientesServiceMock.ts`) - Client management

## What Still Uses Real Services

**Only authentication** - Firebase remains unchanged:
- Login/logout functionality
- User session management
- Firebase authentication

## Mock Data Features

- **Realistic Chilean business data** - Sample properties, contacts, and transactions
- **Simulated API delays** - Feels like real API calls
- **Full CRUD operations** - Create, read, update, delete all work
- **In-memory persistence** - Data persists during session, resets on refresh
- **Consistent relationships** - All IDs and references are properly linked

## File Structure

```
src/services/mock/
├── mockData.ts              # All sample data
├── index.ts                 # Export all mock services
├── propiedadesServiceMock.ts
├── prospectosServiceMock.ts
├── oportunidadesServiceMock.ts
├── propietariosServiceMock.ts
├── empresaServiceMock.ts
├── agentesServiceMock.ts
├── userServiceMock.ts
├── visitasServiceMock.ts
├── multimediaServiceMock.ts
├── notificationsServiceMock.ts
├── saludDataMock.ts
└── clientesServiceMock.ts
```

## Development Benefits

✅ **Independent frontend development** - No backend needed
✅ **Realistic testing environment** - With meaningful sample data
✅ **Full UI functionality** - All features work normally
✅ **Fast iteration** - No API delays or connection issues
✅ **Consistent data** - Same sample data every time

## Sample Data Included

- 5 sample properties (apartments, houses, offices)
- 2 sample prospects with different financial profiles
- 2 active opportunities in different stages
- 2 property owners (individual and company)
- Company profile for "RentOso Propiedades SpA"
- 4 scheduled visits
- Sample documents and images
- Recent activity and notifications

## Authentication Flow

1. **Login/Signup** → Firebase (real)
2. **Business data** → Mock services (sample data)
3. **Session management** → Firebase (real)

The app works exactly as before, just with sample data instead of real backend data.

## How Mock Services Work - Example: "Añadir Prospecto"

### Architecture Overview

The mock service layer simulates a complete backend API without requiring a real server:

1. **Mock Data Storage**: Uses in-memory JavaScript arrays to simulate database tables
2. **Mock Service Layer**: Provides API-like functions with realistic delays
3. **Full CRUD Operations**: Create, read, update, delete all work seamlessly

### Step-by-Step Data Flow

When a user adds a new prospect through "Añadir Prospecto":

#### 1. User Interface
- User fills out the form in `NuevoProspectoModal.tsx`
- Multi-step form collects: personal info, contact details, financial data

#### 2. Form Submission
```typescript
// NuevoProspectoModal.tsx
import { createProspecto } from '../../services/mock/prospectosServiceMock';

const handleFinish = async () => {
  const values = form.getFieldsValue(true);
  const nuevoProspecto = {
    codigoTelefonico: values.codigoTelefonico,
    email: values.email,
    // ... other fields
  };

  await createProspecto(nuevoProspecto); // Mock API call
  message.success('Prospecto agregado correctamente');
  onCreated(); // Refresh parent component
};
```

#### 3. Mock Service Processing
```typescript
// prospectosServiceMock.ts
export const createProspecto = async (prospecto: ProspectoCreate): Promise<Prospecto> => {
  await simulateDelay(); // Simulate 300ms network delay

  const newProspecto: Prospecto = {
    ...prospecto,
    id: generateId(), // Generate unique ID (e.g., "1001")
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockProspectos.push(newProspecto); // Add to in-memory "database"
  return newProspecto;
};
```

#### 4. Data Persistence & Updates
- New prospect is added to `mockProspectos` array
- All components accessing prospects see the update immediately
- Data persists until page refresh
- UI shows loading states during the simulated delay

### Key Mock Service Features

#### Realistic API Simulation
```typescript
// Simulates network delays
export const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generates unique IDs
let nextId = 1000;
export const generateId = (): string => {
  return (++nextId).toString();
};
```

#### Error Handling
```typescript
export const getProspectoById = async (id: string): Promise<Prospecto> => {
  await simulateDelay();
  const prospecto = mockProspectos.find(p => p.id === id);
  if (!prospecto) {
    throw new Error(`Prospecto with id ${id} not found`); // Simulated 404
  }
  return prospecto;
};
```

#### Full CRUD Operations Available
- `getProspectos()` - Fetch all prospects
- `getProspectoById(id)` - Fetch single prospect
- `createProspecto(data)` - Create new prospect
- `updateProspecto(id, updates)` - Update existing prospect

### Backend Migration Path

When ready to connect to a real backend, only imports need to change:

```typescript
// Current (Mock)
import { createProspecto } from '../../services/mock/prospectosServiceMock';

// Future (Real Backend)
import { createProspecto } from '../../services/prospectos/prospectoService';
```

The function signatures and behavior remain identical, ensuring seamless migration.

### Benefits of This Architecture

✅ **Complete functionality** - All features work without backend
✅ **Realistic experience** - Loading states, delays, error handling
✅ **Fast development** - No API setup or maintenance required
✅ **Easy testing** - Consistent, predictable data
✅ **Simple migration** - Just change imports when backend is ready