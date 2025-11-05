import React from 'react';
import { Card, Typography, Statistic, Space, Divider } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import type { Propiedad } from '../../../types/propiedad';

const { Title, Text } = Typography;

interface PropertyStatsProps {
  propiedad: Propiedad;
}

const PropertyStats: React.FC<PropertyStatsProps> = ({ propiedad }) => {
  // Determine if showing rental or sale information
  const isForRent = propiedad.arriendo && propiedad.propiedadArriendo;
  const isForSale = propiedad.venta && propiedad.propiedadVenta;

  if (!isForRent && !isForSale) {
    return null;
  }

  return (
    <Card className="modern-card mb-24">
      <Title level={4}>Información Financiera</Title>
      <Space direction="vertical" size="large" className="w-full">
        {isForRent && propiedad.propiedadArriendo && (
          <>
            <Statistic
              title={<Text strong>Canon Mensual</Text>}
              value={propiedad.propiedadArriendo.precioPrincipal}
              prefix={<DollarOutlined />}
              suffix={propiedad.propiedadArriendo.divisa}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
            />

            {propiedad.propiedadArriendo.incluyeGastosComunes &&
              propiedad.propiedadArriendo.gastosComunes > 0 && (
                <div>
                  <Text strong>Gastos Comunes Incluidos</Text>
                  <br />
                  <Text type="success">
                    ✓ Incluidos en el canon ({propiedad.propiedadArriendo.gastosComunes}{' '}
                    {propiedad.propiedadArriendo.divisa}/mes)
                  </Text>
                </div>
              )}

            {!propiedad.propiedadArriendo.incluyeGastosComunes &&
              propiedad.propiedadArriendo.gastosComunes > 0 && (
                <Statistic
                  title="Gastos Comunes"
                  value={propiedad.propiedadArriendo.gastosComunes}
                  prefix={<DollarOutlined />}
                  suffix={`${propiedad.propiedadArriendo.divisa}/mes`}
                  valueStyle={{ color: '#52c41a' }}
                />
              )}

            <Divider />

            <div>
              <Text strong>Total Mensual</Text>
              <br />
              <Text className="font-bold">
                {propiedad.propiedadArriendo.incluyeGastosComunes
                  ? propiedad.propiedadArriendo.precioPrincipal
                  : propiedad.propiedadArriendo.precioPrincipal +
                    propiedad.propiedadArriendo.gastosComunes}{' '}
                {propiedad.propiedadArriendo.divisa}
              </Text>
            </div>
          </>
        )}

        {isForSale && propiedad.propiedadVenta && (
          <Statistic
            title={<Text strong>Precio de Venta</Text>}
            value={propiedad.propiedadVenta.precioPrincipal}
            prefix={<DollarOutlined />}
            suffix={propiedad.propiedadVenta.divisa}
            valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
          />
        )}
      </Space>
    </Card>
  );
};

export default PropertyStats;
