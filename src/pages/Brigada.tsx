import React, { useState, useEffect } from 'react';
import { osos } from '../services/mock/brigada';
import type { Oso, OsoStatus } from '../services/mock/brigada';
import BearCard from '../components/common/BearCard';
import OsoDrawers from '../components/brigada/OsoDrawers';
import { useMobile } from '../hooks/useMobile';
import '../styles/brigada.scss';
import '../styles/brigada-mobile.scss';

const Brigada: React.FC = () => {
  const [selectedOso, setSelectedOso] = useState<Oso | null>(null);
  const [ososData, setOsosData] = useState(osos);
  const isMobile = useMobile();

  // Simulación de tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setOsosData(prevData => {
        const newData = [...prevData];
        const randomIndex = Math.floor(Math.random() * newData.length);
        const statuses: OsoStatus[] = ['Activo', 'Programado', 'Procesando', 'Completado'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        newData[randomIndex] = {
          ...newData[randomIndex],
          status: randomStatus,
          lastUpdate: 'Hace 1 minuto'
        };
        
        return newData;
      });
    }, 30000); // Actualiza cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (oso: Oso) => {
    setSelectedOso(oso);
  };

  const handleCloseDrawer = () => {
    setSelectedOso(null);
  };

  return (
    <div className="brigada">
      <div className="brigada__header">
        <h1>Brigada de Osos</h1>
        <p>Monitorea y configura tus asistentes en tiempo real</p>
      </div>


      <ul className="brigada__list">
        {ososData.map((oso) => (
          <BearCard
            key={oso.id}
            oso={oso}
            onClick={() => handleCardClick(oso)}
          />
        ))}
      </ul>

      <OsoDrawers
        selectedOso={selectedOso}
        onClose={handleCloseDrawer}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Brigada;