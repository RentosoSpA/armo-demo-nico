import React, { useEffect, useState } from 'react';
import CalendarioLeftPanel from '../components/Calendario/CalendarioLeftPanel';
import CalendarioGrid from '../components/Calendario/CalendarioGrid';
import AddVisitaModal from '../components/Calendario/AddVisitaModal';
import VisitasHeader from '../components/Calendario/VisitasHeader';
import CalendarioStats from '../components/Calendario/CalendarioStats';
import CalendarioStatsEnhanced from '../components/Calendario/CalendarioStatsEnhanced';
import type { Visita } from '../types/visita';
import type { Prospecto } from '../types/profile';
import { getVisitas } from '../services/mock/visitasServiceMock';
import { getProspectos } from '../services/mock/prospectosServiceMock';
import { formatDate } from '../utils/formatters';
import { enhanceVisitasWithCuriosoData } from '../services/mock/curiosoActivityService';
import '../styles/pages/_calendario-grid.scss';

const Calendario = () => {
  const [data, setData] = useState<Visita[]>([]);
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [visitas, prospectosData] = await Promise.all([getVisitas(), getProspectos()]);
      const enhancedVisitas = enhanceVisitasWithCuriosoData(visitas);
      setData(enhancedVisitas);
      setProspectos(prospectosData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ padding: '0 16px 24px 16px' }}>
      {/* Header */}
      <VisitasHeader onAddVisita={() => setAddModalVisible(true)} />
      
      {/* Enhanced CuriOso Stats */}
      <CalendarioStatsEnhanced visitas={data} />
      
      {/* Main Grid Container */}
      <div className="calendarLayout">
        {/* Subheader with date and legend */}
        <div className="calendarSubheader">
          <div className="calendarDate">{formatDate(selectedDate)}</div>
          <div className="calendarLegend">
            <div className="legend-item">
              <div className="dot" style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)' }}></div>
              <span>Confirmada</span>
            </div>
            <div className="legend-item">
              <div className="dot" style={{ background: '#F59E0B', boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)' }}></div>
              <span>Pendiente</span>
            </div>
            <div className="legend-item">
              <div className="dot" style={{ background: '#3B82F6', boxShadow: '0 0 6px rgba(59, 130, 246, 0.6)' }}></div>
              <span>CuriOso Agendando</span>
            </div>
            <div className="legend-item">
              <div className="dot" style={{ background: '#EF4444' }}></div>
              <span>Cancelada</span>
            </div>
          </div>
        </div>

        {/* Left Panel */}
        <CalendarioLeftPanel
          selectedDate={selectedDate}
          visitas={data}
          onAddVisita={() => setAddModalVisible(true)}
        />

        {/* Main Calendar Area */}
        <CalendarioGrid
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          visitas={data}
        />
      </div>

      {/* Add Visit Modal */}
      <AddVisitaModal
        visible={addModalVisible}
        prospectos={prospectos}
        selectedDate={selectedDate}
        onCancel={() => setAddModalVisible(false)}
        onReload={fetchData}
      />
    </div>
  );
};

export default Calendario;
