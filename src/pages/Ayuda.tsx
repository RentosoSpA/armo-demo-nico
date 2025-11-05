import React from 'react';
import { Typography, Collapse, Divider, List } from 'antd';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ayudaData = [
  {
    key: '1',
    header: '¿Cómo funciona el buscador?',
    content: (
      <>
        <div className="paragraph-text">
          El buscador te permite encontrar propiedades rápidamente. Solo tienes que escribir una
          palabra clave, dirección o ciudad en la barra de búsqueda y presionar{' '}
          <Text strong>Enter</Text> o hacer clic en el botón de búsqueda.
        </div>
        <List
          size="small"
          dataSource={[
            'Puedes buscar por nombre de la propiedad, ciudad o zona.',
            'Los resultados se actualizan automáticamente según tu búsqueda.',
            'Si no encuentras lo que buscas, intenta con diferentes palabras clave.',
          ]}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </>
    ),
  },
  {
    key: '2',
    header: '¿Cómo usar los filtros?',
    content: (
      <>
        <div className="paragraph-text">
          Los filtros te ayudan a refinar los resultados de búsqueda. Puedes filtrar por:
        </div>
        <List
          size="small"
          dataSource={[
            'Tipo de propiedad (departamento, casa, etc.)',
            'Rango de precio',
            'Número de habitaciones',
            'Servicios incluidos',
          ]}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
        <div className="paragraph-text">
          Selecciona las opciones que desees y los resultados se actualizarán automáticamente.
        </div>
      </>
    ),
  },
  {
    key: '3',
    header: '¿Qué hago si tengo problemas?',
    content: (
      <>
        <div className="paragraph-text">
          Si tienes algún inconveniente con la plataforma, puedes contactarnos a través del
          formulario de contacto o enviando un correo a <Text code>soporte@rentoso.com</Text>.
        </div>
      </>
    ),
  },
];

const Ayuda: React.FC = () => (
  <div className="ayuda-container">
    <Typography>
      <Title level={2} className="title-text">Ayuda</Title>
      <div className="paragraph-text">
        Aquí encontrarás respuestas a las preguntas más frecuentes sobre cómo utilizar la
        plataforma.
      </div>
    </Typography>
    <Divider />
    <Collapse accordion>
      {ayudaData.map(({ key, header, content }) => (
        <Panel header={header} key={key}>
          {content}
        </Panel>
      ))}
    </Collapse>

    <Divider />
  </div>
);

export default Ayuda;
