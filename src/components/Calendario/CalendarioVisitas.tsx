import { Card, Typography, Button, Space, Spin } from 'antd';
import type { Visita } from '../../types/visita';
import type { Prospecto } from '../../types/profile';
import VisitaCard from './VisitaCard';
import AddVisitaModal from './AddVisitaModal';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';
import '../../styles/components/_calendario.scss';

const { Title } = Typography;

interface Props {
  isLoading: boolean;
  data: Visita[];
  prospectos: Prospecto[];
  selectedDate: string;
  onReload: () => void;
}

const CalendarioVisitas = ({ isLoading, data, prospectos, selectedDate, onReload }: Props) => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const visitasHoy = data.filter(v => {
    const visitaDate = dayjs(v.fecha_inicio);
    return visitaDate.format('YYYY-MM-DD') === selectedDate;
  });

  return (
    <Card
      id="calendario-visitas"
      className="d-flex flex-column h-full"
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        },
      }}
      title={
        <div className="d-flex align-center justify-between">
          <Title level={5} className="m-0">
            Visitas para {dayjs(selectedDate).locale('es').format('dddd, DD [de] MMMM [de] YYYY')}
          </Title>
          <Button
            type="primary"
            onClick={() => setAddModalVisible(true)}
            title="Agregar nueva visita"
            className="p-5 h-auto w-auto"
          >
            Agendar
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="d-flex align-center justify-center">
          <Spin />
        </div>
      ) : visitasHoy.length === 0 ? (
        <div className="d-flex align-center justify-center">
          <div className="calendario-empty">No hay visitas programadas para este día</div>  
        </div>
      ) : (
        <>
          <div className="overflow-y-auto pr-4">
            <Space direction="vertical" className="w-full" size="middle">
              {visitasHoy.map(v => (
                <VisitaCard key={v.id} visita={v} onReload={onReload} />
              ))}
            </Space>
          </div>
        </>
      )}

      <AddVisitaModal
        visible={addModalVisible}
        prospectos={prospectos}
        selectedDate={selectedDate}
        onCancel={() => setAddModalVisible(false)}
        onReload={onReload}
      />
    </Card>
  );
};

export default CalendarioVisitas;
