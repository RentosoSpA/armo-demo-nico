import React from 'react';
import { Table, Badge } from 'antd';
import type { Comision } from '../../types/finanzas';

interface TablaComisionesProps {
  comisiones: Comision[];
  onClickPropiedad: (propiedadId: string) => void;
}

const TablaComisiones: React.FC<TablaComisionesProps> = ({ comisiones, onClickPropiedad }) => {
  const getEstadoBadge = (estado: Comision['estado']) => {
    const config = {
      'Pagada': { status: 'success' as const, text: 'Pagada' },
      'Pendiente': { status: 'processing' as const, text: 'Pendiente' },
      'Atrasada': { status: 'error' as const, text: 'Atrasada' },
    };

    const { status, text } = config[estado];
    return <Badge status={status} text={text} />;
  };

  const columns = [
    {
      title: 'Propiedad',
      dataIndex: 'propiedadNombre',
      key: 'propiedadNombre',
      render: (text: string, record: Comision) => (
        <a 
          onClick={() => onClickPropiedad(record.propiedadId)}
          className="tabla-comisiones-link"
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Comisión',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto: number) => (
        <span className="tabla-comisiones-monto">
          ${monto.toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: Comision['estado']) => getEstadoBadge(estado),
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaEsperada',
      key: 'fechaEsperada',
      render: (fecha: string) => new Date(fecha).toLocaleDateString('es-CL'),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (tipo: string) => (
        <span className="tabla-comisiones-tipo">
          {tipo === 'arriendo' ? 'Arriendo' : 'Venta'}
        </span>
      ),
    },
  ];

  return (
    <div className="tabla-comisiones-container">
      <Table
        columns={columns}
        dataSource={comisiones}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="tabla-comisiones"
      />
    </div>
  );
};

export default TablaComisiones;
