import React, { useState, useEffect } from 'react';
import OsoFlipCard from './OsoFlipCard';

interface OsoData {
  id: string;
  name: string;
  description: string;
  color: string;
  activeTasks: number;
  completedTasks: number;
  lastActivity: Date;
}

interface OsosBrigadaProps {
  loading?: boolean;
}

const initialOsosData: OsoData[] = [
  {
    id: 'curioso',
    name: 'Oso Curioso',
    description: 'Ayuda a encontrar prospectos para tus propiedades',
    color: '#3B82F6',
    activeTasks: 25,
    completedTasks: 10,
    lastActivity: new Date(Date.now() - 2 * 60000) // Hace 2 minutos
  },
  {
    id: 'cauteloso',
    name: 'Oso Cauteloso',
    description: 'Evalúa a los prospectos de tus propiedades',
    color: '#10B981',
    activeTasks: 18,
    completedTasks: 32,
    lastActivity: new Date(Date.now() - 5 * 60000) // Hace 5 minutos
  },
  {
    id: 'notarioso',
    name: 'Oso Notarioso',
    description: 'Configura los contratos con los prospectos',
    color: '#F59E0B',
    activeTasks: 12,
    completedTasks: 8,
    lastActivity: new Date(Date.now() - 10 * 60000) // Hace 10 minutos
  },
  {
    id: 'cuidadoso',
    name: 'Oso Cuidadoso',
    description: 'Te ayuda en la recaudación de pagos',
    color: '#EF4444',
    activeTasks: 7,
    completedTasks: 15,
    lastActivity: new Date(Date.now() - 15 * 60000) // Hace 15 minutos
  }
];

// Función helper para simular cambios en tareas
const simulateTaskUpdate = (oso: OsoData): OsoData => {
  const shouldUpdate = Math.random() > 0.5;
  if (!shouldUpdate) return oso;

  const activeChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  const completedChange = Math.random() > 0.7 ? 1 : 0; // 30% chance de completar tarea
  
  return {
    ...oso,
    activeTasks: Math.max(0, oso.activeTasks + activeChange),
    completedTasks: oso.completedTasks + completedChange,
    lastActivity: Math.random() > 0.3 ? new Date() : oso.lastActivity // 70% chance de actualizar actividad
  };
};

const OsosBrigada: React.FC<OsosBrigadaProps> = ({ loading = false }) => {
  const [ososData, setOsosData] = useState<OsoData[]>(initialOsosData);
  const [expandedOsoId, setExpandedOsoId] = useState<string | null>(null);

  // Simular actualizaciones en tiempo real cada 3-5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setOsosData(prevOsos => 
        prevOsos.map(oso => simulateTaskUpdate(oso))
      );
    }, 3000 + Math.random() * 2000); // Entre 3 y 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleToggleExpand = (osoId: string) => {
    setExpandedOsoId(prev => prev === osoId ? null : osoId);
  };
  if (loading) {
    return (
      <div className="loading-container">
        <span>Cargando datos de la brigada...</span>
      </div>
    );
  }

  return (
    <div className="oso-brigada">
      <div className="brigada-header">
        <h2 className="brigada-title">Brigada de osos</h2>
        <p className="brigada-subtitle">Revisa como los osos están trabajando</p>
      </div>

      <div className={`brigada-container ${expandedOsoId ? 'has-expanded' : ''}`}>
        {ososData.map((oso) => (
          <OsoFlipCard 
            key={oso.id}
            id={oso.id}
            name={oso.name}
            description={oso.description}
            color={oso.color}
            activeTasks={oso.activeTasks}
            completedTasks={oso.completedTasks}
            lastActivity={oso.lastActivity}
            isExpanded={expandedOsoId === oso.id}
            onToggleExpand={() => handleToggleExpand(oso.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OsosBrigada;