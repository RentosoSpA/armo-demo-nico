# Guía de Performance - RentOso Frontend

## 📋 Índice
1. [Anti-patrones Identificados](#anti-patrones-identificados)
2. [Patrones Correctos](#patrones-correctos)
3. [Ejemplos de useEffect Correcto](#ejemplos-de-useeffect-correcto)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Checklist de Optimización](#checklist-de-optimización)

---

## ❌ Anti-patrones Identificados

### 1. Funciones del Store en Dependencias de useEffect

**❌ INCORRECTO:**
```typescript
const { fetchPropiedades } = usePropiedadStore();

useEffect(() => {
  fetchPropiedades(empresa?.id);
}, [empresa?.id, fetchPropiedades]); // ❌ Causa re-renders infinitos
```

**Por qué es malo:**
- Las funciones del store Zustand son estables pero pueden cambiar su referencia
- Incluirlas en dependencias causa re-renders infinitos
- El store se recarga completamente en cada navegación

**✅ CORRECTO:**
```typescript
const { fetchPropiedades } = usePropiedadStore();

useEffect(() => {
  fetchPropiedades(empresa?.id);
}, [empresa?.id]); // ✅ Solo depende de empresa?.id
```

---

### 2. Limpiar localStorage en Cada Render

**❌ INCORRECTO:**
```typescript
const Propietarios = () => {
  // Esto se ejecuta en CADA render, no solo en mount
  if (import.meta.env.DEV) {
    localStorage.removeItem('propietario-store');
  }
  
  // ... resto del componente
};
```

**Por qué es malo:**
- Se ejecuta en cada render, no solo en el montaje inicial
- Limpia el store cada vez que el componente se re-renderiza
- Causa pérdida de estado y recargas constantes

**✅ CORRECTO:**
```typescript
const Propietarios = () => {
  // Si realmente necesitas limpiar localStorage, hazlo en un useEffect con [] deps
  useEffect(() => {
    if (import.meta.env.DEV) {
      localStorage.removeItem('propietario-store');
    }
  }, []); // Se ejecuta solo una vez al montar
  
  // ... resto del componente
};
```

**✅ MEJOR AÚN:**
```typescript
// No limpies el store en producción ni en desarrollo
// Usa las herramientas de dev de React/Zustand para depurar
const Propietarios = () => {
  // ... componente sin limpieza de localStorage
};
```

---

### 3. Handlers No Memoizados

**❌ INCORRECTO:**
```typescript
const handleClick = (id: string) => {
  doSomething(id);
};

return <Component onClick={handleClick} />;
```

**Por qué es malo:**
- Crea una nueva función en cada render
- Causa re-renders innecesarios en componentes hijos
- Rompe la optimización de React.memo()

**✅ CORRECTO:**
```typescript
const handleClick = useCallback((id: string) => {
  doSomething(id);
}, [dependencies]); // Solo se recrea si dependencies cambian

return <Component onClick={handleClick} />;
```

---

### 4. Componentes Sin Memoización

**❌ INCORRECTO:**
```typescript
const MyTable = ({ data, onEdit }) => {
  return <Table data={data} onEdit={onEdit} />;
};

export default MyTable;
```

**Por qué es malo:**
- Se re-renderiza incluso si props no cambiaron
- Especialmente crítico en tablas y listas grandes
- Desperdicia recursos de renderizado

**✅ CORRECTO:**
```typescript
const MyTable = ({ data, onEdit }) => {
  return <Table data={data} onEdit={onEdit} />;
};

export default React.memo(MyTable);
```

---

### 5. Cálculos Pesados Sin useMemo

**❌ INCORRECTO:**
```typescript
const MyComponent = ({ opportunities }) => {
  // Esto se ejecuta en CADA render
  const convertedData = opportunities.map(opp => ({
    id: opp.id,
    name: opp.prospecto?.display_name,
    // ... más transformaciones
  }));
  
  return <Table data={convertedData} />;
};
```

**Por qué es malo:**
- La conversión se ejecuta en cada render
- Desperdicia CPU en cálculos repetidos
- Puede causar lag en la UI

**✅ CORRECTO:**
```typescript
const MyComponent = ({ opportunities }) => {
  const convertedData = useMemo(() => {
    return opportunities.map(opp => ({
      id: opp.id,
      name: opp.prospecto?.display_name,
      // ... más transformaciones
    }));
  }, [opportunities]); // Solo se recalcula si opportunities cambia
  
  return <Table data={convertedData} />;
};
```

---

### 6. Console.logs en Producción

**❌ INCORRECTO:**
```typescript
const fetchData = async () => {
  console.log('Fetching data...');
  const data = await getData();
  console.log('Data received:', data);
  return data;
};
```

**Por qué es malo:**
- Degrada performance en producción
- Llena la consola del usuario
- Puede exponer información sensible

**✅ CORRECTO:**
```typescript
const fetchData = async () => {
  if (import.meta.env.DEV) {
    console.log('Fetching data...');
  }
  const data = await getData();
  if (import.meta.env.DEV) {
    console.log('Data received:', data);
  }
  return data;
};
```

---

## ✅ Patrones Correctos

### 1. useEffect con Dependencias Correctas

```typescript
// ✅ Fetch de datos al montar o cuando empresa cambia
useEffect(() => {
  fetchData(empresa?.id);
}, [empresa?.id]);

// ✅ Múltiples callbacks memoizados
useEffect(() => {
  fetchData();
  fetchStats();
}, [fetchData, fetchStats]); // OK si están memoizados con useCallback
```

### 2. Memoización de Callbacks

```typescript
// ✅ Callback simple sin dependencias
const handleClick = useCallback(() => {
  navigate('/some-path');
}, [navigate]);

// ✅ Callback con dependencias
const handleSave = useCallback(async (id: string) => {
  await saveData(id, empresa?.id);
  fetchData();
}, [empresa?.id, fetchData]);
```

### 3. Memoización de Cálculos

```typescript
// ✅ Filtrado de datos
const filteredData = useMemo(() => {
  return data.filter(item => item.status === filter);
}, [data, filter]);

// ✅ Transformación de datos
const mappedData = useMemo(() => {
  return items.map(item => ({
    ...item,
    fullName: `${item.firstName} ${item.lastName}`
  }));
}, [items]);
```

### 4. Componentes Memoizados

```typescript
// ✅ Componente simple
const MyCard = React.memo(({ title, content }) => {
  return <Card title={title}>{content}</Card>;
});

// ✅ Componente con comparación personalizada
const MyTable = React.memo(
  ({ data, onEdit }) => {
    return <Table data={data} onEdit={onEdit} />;
  },
  (prevProps, nextProps) => {
    // Solo re-renderizar si data cambió
    return prevProps.data === nextProps.data;
  }
);
```

---

## 📚 Ejemplos de useEffect Correcto

### Ejemplo 1: Fetch Simple al Montar

```typescript
const MyComponent = () => {
  const { empresa } = useUserStore();
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData(empresa?.id);
      setData(result);
    };
    
    if (empresa?.id) {
      loadData();
    }
  }, [empresa?.id]); // ✅ Solo depende de empresa?.id

  return <div>{/* ... */}</div>;
};
```

### Ejemplo 2: Múltiples Fetches con Callbacks Memoizados

```typescript
const MyComponent = () => {
  const { empresa } = useUserStore();
  
  const fetchPrimary = useCallback(async () => {
    const data = await getPrimaryData(empresa?.id);
    setData(data);
  }, [empresa?.id]);
  
  const fetchSecondary = useCallback(async () => {
    const stats = await getStats(empresa?.id);
    setStats(stats);
  }, [empresa?.id]);

  useEffect(() => {
    fetchPrimary();
    fetchSecondary();
  }, [fetchPrimary, fetchSecondary]); // ✅ Callbacks están memoizados

  return <div>{/* ... */}</div>;
};
```

### Ejemplo 3: Efecto Condicional

```typescript
const MyComponent = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!showDetails) return;
    
    const loadDetails = async () => {
      const data = await fetchDetails();
      setDetails(data);
    };
    
    loadDetails();
  }, [showDetails]); // ✅ Se ejecuta cuando showDetails cambia a true

  return <div>{/* ... */}</div>;
};
```

---

## 🛠️ Hooks Personalizados

### useStableCallback

Para callbacks que necesitan acceso a props/state actuales sin causar re-renders:

```typescript
import { useStableCallback } from '../hooks/useStableCallback';

const MyComponent = ({ onSave, currentUser }) => {
  const handleSave = useStableCallback((id: string) => {
    // Siempre usa la última versión de onSave y currentUser
    onSave(id, currentUser);
  });

  useEffect(() => {
    // handleSave es estable, no causa re-renders
    someSubscription(handleSave);
  }, []); // ✅ No necesita handleSave en deps

  return <div>{/* ... */}</div>;
};
```

---

## ✅ Checklist de Optimización

Usa esta checklist al crear o revisar componentes:

### Componente
- [ ] Funciones del store NO están en dependencias de useEffect
- [ ] No hay código ejecutándose en cada render (como limpieza de localStorage)
- [ ] Componentes de tabla/lista están envueltos en React.memo()
- [ ] Props callback están memoizados con useCallback

### Hooks
- [ ] useEffect tiene solo las dependencias necesarias
- [ ] Callbacks están memoizados con useCallback
- [ ] Cálculos pesados están memoizados con useMemo
- [ ] No hay funciones async directamente en useEffect (usar función interna)

### Performance
- [ ] No hay transformaciones de datos pesadas sin useMemo
- [ ] Console.logs están condicionados a DEV mode
- [ ] No hay re-renders innecesarios (verificar con React DevTools Profiler)

### Testing
- [ ] Navegar entre páginas no recarga datos innecesariamente
- [ ] Estado persiste al cambiar de pestaña y volver
- [ ] Menos de 3 renders por navegación de página

---

## 🎯 Métricas de Performance Objetivo

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| Renders por navegación | < 3 | > 10 |
| Tiempo de carga inicial | < 2s | > 5s |
| Tiempo de navegación | < 500ms | > 2s |
| Re-renders innecesarios | 0 | > 5 |

---

## 📖 Recursos Adicionales

- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/performance)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [useMemo vs useCallback](https://react.dev/reference/react/useMemo)

---

## 🔍 Debugging Performance

### Usar React DevTools Profiler

1. Abre Chrome DevTools
2. Ve a la pestaña "Profiler"
3. Click en "Record"
4. Navega entre páginas
5. Click en "Stop"
6. Revisa los componentes que se re-renderizaron

### Identificar Re-renders Innecesarios

```typescript
// Agregar temporalmente para debug
useEffect(() => {
  console.log('Component rendered:', { props, state });
});
```

### Verificar Dependencias de useEffect

```typescript
// Use eslint-plugin-react-hooks para advertencias
// Debe mostrar warning si faltan dependencias
useEffect(() => {
  doSomething(prop1, prop2);
}, []); // ⚠️ ESLint mostrará warning
```

---

## 🏪 Stores con Persistencia y Caché TTL

### Patrón Implementado

Todos los stores principales (Oportunidades, Prospectos, Propiedades, Propietarios) usan el patrón de persistencia con caché TTL:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const useMyStore = create()(
  persist(
    (set, get) => ({
      data: [],
      loading: false,
      lastFetched: null,
      
      fetchData: async (id: string) => {
        // Verificar caché antes de hacer fetch
        const { lastFetched, data } = get();
        const now = Date.now();
        
        if (lastFetched && data.length > 0 && (now - lastFetched) < CACHE_TTL) {
          console.log('✅ Using cached data');
          return data;
        }

        // Fetch solo si caché expiró
        set({ loading: true });
        const freshData = await apiCall(id);
        set({ data: freshData, loading: false, lastFetched: now });
        console.log('✅ Fetched fresh data from API');
        return freshData;
      },
      
      // Actualización optimista sin refetch
      updateLocal: (id: string, updates: any) => {
        set(state => ({
          data: state.data.map(item => 
            item.id === id ? { ...item, ...updates } : item
          ),
          lastFetched: Date.now() // Actualizar timestamp
        }));
      },
      
      // Agregar item sin refetch
      addLocal: (item: any) => {
        set(state => ({
          data: [...state.data, item],
          lastFetched: Date.now()
        }));
      },
      
      // Forzar refresh cuando sea necesario
      invalidateCache: () => {
        set({ lastFetched: null });
      },
    }),
    {
      name: 'my-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
```

### Beneficios del Patrón

✅ **Rendimiento mejorado:**
- Evita re-fetches innecesarios al cambiar de pestaña
- Caché de 5 minutos reduce llamadas al servidor
- Estado persiste entre navegaciones

✅ **UX mejorada:**
- Sin loading spinners constantes
- Respuesta inmediata al navegar
- Actualizaciones optimistas en UI

✅ **Código mantenible:**
- Lógica de caché centralizada en stores
- Fácil de invalidar cuando sea necesario
- Logs automáticos para debugging

### Cuándo Usar Actualización Optimista vs Refetch

#### ✅ Actualización Optimista (Recomendado)

Usar cuando:
- La acción tiene alta probabilidad de éxito
- La UI necesita responder inmediatamente
- Puedes revertir en caso de error

```typescript
const handleUpdate = async (id: string, newValue: string) => {
  // 1. Actualizar UI inmediatamente
  updateLocal(id, { value: newValue });
  
  try {
    // 2. Confirmar en servidor
    await apiUpdate(id, { value: newValue });
    message.success('Actualizado');
  } catch (error) {
    // 3. Revertir si falla
    await fetchData();
    message.error('Error al actualizar');
  }
};
```

Ejemplos:
- Cambiar estado de oportunidad
- Editar campos de texto
- Marcar/desmarcar checkboxes

#### ❌ Refetch Completo (Evitar)

Solo usar cuando:
- La respuesta del servidor tiene datos calculados
- No conoces el estado final hasta que el servidor responde
- La operación puede afectar múltiples registros

```typescript
const handleComplexUpdate = async () => {
  try {
    await complexApiOperation();
    // Invalidar caché y refetch
    invalidateCache();
    await fetchData();
  } catch (error) {
    message.error('Error');
  }
};
```

Ejemplos:
- Importación masiva de datos
- Recálculos complejos del servidor
- Operaciones que afectan relaciones entre entidades

### Logs de Debugging

Los stores incluyen logs automáticos para verificar el uso del caché:

```
✅ Using cached oportunidades (valid for 287 more seconds)
✅ Fetched fresh oportunidades from API
🔄 Cache invalidated for oportunidades
```

Para depuración adicional:

```typescript
// Ver estado actual del store
console.log(useOportunidadesStore.getState());

// Verificar timestamp de último fetch
const { lastFetched } = useOportunidadesStore.getState();
console.log('Fetched', Math.round((Date.now() - lastFetched) / 1000), 'seconds ago');
```

---

## 🧪 Tests E2E Recomendados

### Test 1: Sin Re-fetches al Cambiar de Pestaña

**Objetivo:** Verificar que navegar entre páginas no recarga datos desde el servidor.

```typescript
describe('Navigation Performance', () => {
  it('should NOT refetch when navigating back to Oportunidades', async () => {
    // 1. Visitar Oportunidades (primer fetch)
    await page.goto('/oportunidades');
    await page.waitForSelector('.oportunidades-header');
    
    const firstFetchCount = await countNetworkRequests('/oportunidades');
    expect(firstFetchCount).toBeGreaterThan(0);
    
    // 2. Navegar a otra página
    await page.goto('/propiedades');
    await page.waitForSelector('.propiedades-header');
    
    // 3. Volver a Oportunidades (debe usar caché)
    await page.goto('/oportunidades');
    await page.waitForSelector('.oportunidades-header');
    
    const secondFetchCount = await countNetworkRequests('/oportunidades');
    expect(secondFetchCount).toBe(0); // ✅ Sin requests adicionales
  });
});
```

### Test 2: Caché Expira Después de TTL

**Objetivo:** Verificar que el caché se invalida después del TTL.

```typescript
describe('Cache TTL', () => {
  it('should refetch after 5 minutes', async () => {
    // 1. Primer fetch
    await page.goto('/oportunidades');
    const firstFetchTime = Date.now();
    
    // 2. Navegar fuera y volver antes de TTL
    await page.goto('/propiedades');
    await page.goto('/oportunidades');
    expect(await countNetworkRequests()).toBe(0);
    
    // 3. Simular paso de tiempo (5+ minutos)
    await page.evaluate(() => {
      const store = sessionStorage.getItem('oportunidades-storage');
      const data = JSON.parse(store);
      data.state.lastFetched = Date.now() - (6 * 60 * 1000);
      sessionStorage.setItem('oportunidades-storage', JSON.stringify(data));
    });
    
    // 4. Volver a Oportunidades (debe refetch)
    await page.goto('/oportunidades');
    expect(await countNetworkRequests()).toBeGreaterThan(0);
  });
});
```

### Test 3: Actualización Optimista

**Objetivo:** Verificar que los cambios aparecen en UI antes de confirmarse en servidor.

```typescript
describe('Optimistic Updates', () => {
  it('should update UI immediately when changing opportunity stage', async () => {
    await page.goto('/oportunidades');
    
    // Interceptar request para hacerla lenta
    await page.route('**/oportunidades/*', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    // Cambiar etapa de oportunidad
    await page.click('.kanban-card:first-child [data-stage-dropdown]');
    await page.click('[data-stage="Negociacion"]');
    
    // Verificar que UI se actualizó ANTES de que termine el request
    await page.waitForTimeout(100); // Esperar render
    const newStage = await page.locator('.kanban-card:first-child .stage-badge').textContent();
    expect(newStage).toBe('Negociación');
    
    // Request aún no terminó
    const isPending = await page.evaluate(() => {
      return fetch.mock.calls.some(call => call.pending);
    });
    expect(isPending).toBe(true);
  });
});
```

### Test 4: Agregar Items Sin Refetch

**Objetivo:** Verificar que crear nuevos items los agrega localmente sin refetch.

```typescript
describe('Add Items Locally', () => {
  it('should add new opportunity without refetching all', async () => {
    await page.goto('/oportunidades');
    
    const initialCount = await page.locator('.kanban-card').count();
    
    // Crear nueva oportunidad
    await page.click('[data-btn-nueva-oportunidad]');
    await page.fill('[name="prospecto_id"]', 'prospecto-123');
    await page.fill('[name="propiedad_id"]', 'prop-456');
    await page.click('[type="submit"]');
    
    await page.waitForSelector('.kanban-card', { count: initialCount + 1 });
    
    // Verificar que NO se hizo refetch de todas las oportunidades
    const fetchAllCalled = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .some(r => r.name.includes('/oportunidades?empresa'));
    });
    expect(fetchAllCalled).toBe(false);
  });
});
```

### Helpers de Testing

```typescript
// Helper para contar network requests
async function countNetworkRequests(pattern?: string) {
  return await page.evaluate((p) => {
    const entries = window.performance.getEntriesByType('resource');
    return p 
      ? entries.filter(e => e.name.includes(p)).length
      : entries.length;
  }, pattern);
}

// Helper para limpiar sessionStorage entre tests
beforeEach(async () => {
  await page.evaluate(() => sessionStorage.clear());
});
```

---

**Última actualización:** Fase 5 completada - Stores con persistencia, caché TTL y tests E2E
**Mantenedor:** Equipo RentOso
