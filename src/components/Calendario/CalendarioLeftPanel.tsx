import React, { useState, useEffect } from 'react';
import { Typography, Button, Space } from 'antd';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import type { Visita } from '../../types/visita';
import CuriosoActivityFeed from './CuriosoActivityFeed';
import VisitaSmartCard from './VisitaSmartCard';
import { getCuriosoActivities, getCuriosoStats } from '../../services/mock/curiosoActivityService';
import type { CuriosoActivity } from './CuriosoActivityFeed';
import type { CuriosoStats } from '../../services/mock/curiosoActivityService';

dayjs.locale('es');

const { Text } = Typography;

interface CalendarioLeftPanelProps {
  selectedDate: string;
  visitas: Visita[];
  onAddVisita: () => void;
}

const CalendarioLeftPanel = ({ selectedDate, visitas, onAddVisita }: CalendarioLeftPanelProps) => {
  const [activities, setActivities] = useState<CuriosoActivity[]>([]);
  const [stats, setStats] = useState<CuriosoStats | null>(null);
  const [loading, setLoading] = useState(true);

  const visitasHoy = visitas.filter(v => 
    dayjs(v.fecha_inicio).format('YYYY-MM-DD') === selectedDate
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activitiesData, statsData] = await Promise.all([
          getCuriosoActivities(),
          getCuriosoStats(visitas)
        ]);
        setActivities(activitiesData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading CuriOso data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [visitas]);

  return (
    <div className="leftPanel">
      {/* CuriOso Activity Feed */}
      <div className="mb-16">
        <CuriosoActivityFeed activities={activities} isTyping={loading} />
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="mb-16" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <Text style={{ fontSize: '13px', color: '#9ca3af' }}>
            📊 Visitas esta semana: <strong style={{ color: '#33F491' }}>{stats.visitasEstaSemana}</strong>
          </Text>
          <br />
          <Text style={{ fontSize: '13px', color: '#9ca3af' }}>
            🐻‍❄️ Por CuriOso: <strong style={{ color: '#33F491' }}>{stats.porcentajeAgendadasPorCurioso}%</strong>
          </Text>
        </div>
      )}

      {/* Visits Section */}
      <div className="visitasPanel mb-16">
        <div className="d-flex align-center justify-between mb-16">
          <Text className="font-semibold">
            Visitas programadas
          </Text>
          <Button
            type="text"
            icon={<Plus size={16} />}
            onClick={onAddVisita}
            style={{
              padding: '4px 8px',
              height: 'auto',
              color: '#33F491'
            }}
          />
        </div>
        <div className="pr-4">
          {visitasHoy.length === 0 ? (
            <div className="text-center p-24">
              No hay visitas programadas para este día
            </div>
          ) : (
            <Space direction="vertical" className="w-full" size="middle">
              {visitasHoy.map(visita => (
                <VisitaSmartCard
                  key={visita.id}
                  visita={visita}
                  compact={true}
                  showActions={false}
                />
              ))}
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarioLeftPanel;