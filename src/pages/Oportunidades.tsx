import { useEffect, useState } from 'react';
import { Empty } from 'antd';
import OportunidadesHeader from '../components/oportunidades/OportunidadesHeader';
import { BrigadaActivityFeed } from '../components/oportunidades/BrigadaActivityFeed';
import { WhatsAppChatArea } from '../components/oportunidades/WhatsAppChatArea';
import { useWhatsAppChatStore } from '../store/whatsappChatStore';
import { useWhatsAppSimulation } from '../hooks/useWhatsAppSimulation';
import { useBrigadaSimulation } from '../hooks/useBrigadaSimulation';
import { generateLeadsForProperty } from '../services/mock/whatsappChatMockGenerator';
import { generateConversation } from '../services/mock/whatsappConversationGenerator';
import { generateInitialActivities } from '../services/mock/brigadaActivityGenerator';
import { usePropiedadStore } from '../store/propiedadStore';
import type { WhatsAppChat } from '../types/whatsapp-chat';

const Oportunidades = () => {
  const [selectedPropiedadId, setSelectedPropiedadId] = useState<string | null>('all');
  const { propiedades, fetchPropiedades } = usePropiedadStore();
  const { setChats, chats, setBrigadaActivities, selectChat } = useWhatsAppChatStore();
  
  const simulationEnabled = selectedPropiedadId !== null;
  useWhatsAppSimulation(simulationEnabled);
  useBrigadaSimulation(simulationEnabled);

  useEffect(() => {
    fetchPropiedades('mock');
  }, [fetchPropiedades]);

  // Cargar automáticamente todos los chats al montar el componente
  useEffect(() => {
    if (propiedades.length > 0 && selectedPropiedadId === 'all') {
      handleSelectPropiedad('all');
    }
  }, [propiedades]);

  const handleSelectPropiedad = (propiedadId: string | null) => {
    setSelectedPropiedadId(propiedadId);
    selectChat('todos');
    
    if (!propiedadId) {
      setChats([]);
      setBrigadaActivities([]);
      return;
    }

    // Si es 'all', generar chats de TODAS las propiedades
    if (propiedadId === 'all') {
      const allChats: WhatsAppChat[] = [];
      const allLeadData: Array<{ nombre: string; propiedadTitulo: string }> = [];
      
      propiedades.forEach(propiedad => {
        const leads = generateLeadsForProperty(propiedad.id);
        
        leads.forEach(lead => {
          const chatId = `chat_${lead.id}`;
          const { messages, extractedName } = generateConversation(lead, chatId, propiedad);
          
          const updatedLead = {
            ...lead,
            nombre: extractedName,
            nombreReal: extractedName,
            email: `${extractedName.toLowerCase().replace(/ /g, '.')}@${
              ['gmail.com', 'hotmail.com', 'outlook.com'][Math.floor(Math.random() * 3)]
            }`,
            status: lead.status || 'activo'
          };
          
          allChats.push({
            id: chatId,
            leadId: lead.id,
            lead: updatedLead,
            propiedadId: propiedad.id,
            messages,
            status: lead.status || 'activo',
            lastMessageTime: messages[messages.length - 1]?.timestamp || new Date().toISOString(),
            unreadCount: Math.floor(Math.random() * 3),
            isAIControlled: true,
            etapaOportunidad: 'Exploracion'
          });
          
          allLeadData.push({ nombre: extractedName, propiedadTitulo: propiedad.titulo });
        });
      });
      
      setChats(allChats);
      
      // Generar más actividades para todas las propiedades
      const activities = generateInitialActivities(allLeadData, 60);
      setBrigadaActivities(activities);
      return;
    }

    // Generar para una propiedad específica
    const propiedad = propiedades.find(p => p.id === propiedadId);
    if (!propiedad) return;

    // Generar leads
    const leads = generateLeadsForProperty(propiedadId);
    
    // Generar chats
    const newChats: WhatsAppChat[] = leads.map(lead => {
      const chatId = `chat_${lead.id}`;
      const { messages, extractedName } = generateConversation(lead, chatId, propiedad);
      
      // Actualizar el lead con el nombre real extraído
      const updatedLead = {
        ...lead,
        nombre: extractedName,
        nombreReal: extractedName,
        email: `${extractedName.toLowerCase().replace(/ /g, '.')}@${
          ['gmail.com', 'hotmail.com', 'outlook.com'][Math.floor(Math.random() * 3)]
        }`,
        status: lead.status || 'activo'
      };
      
      return {
        id: chatId,
        leadId: lead.id,
        lead: updatedLead,
        propiedadId,
        messages,
        status: lead.status || 'activo',
        lastMessageTime: messages[messages.length - 1]?.timestamp || new Date().toISOString(),
        unreadCount: Math.floor(Math.random() * 3),
        isAIControlled: true,
        etapaOportunidad: 'Exploracion'
      };
    });

    setChats(newChats);

    // Generar actividades
    const activities = generateInitialActivities(
      leads.map(l => ({ nombre: l.nombre, propiedadTitulo: propiedad.titulo })),
      40
    );
    setBrigadaActivities(activities);
  };

  const stats = {
    encontrados: chats.length,
    evaluados: chats.filter(c => c.status === 'aceptado').length,
    enviados: chats.filter(c => c.messages.length > 5).length
  };

  return (
    <div className="oportunidades-page-v2" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <OportunidadesHeader
        onSearch={() => {}}
        onAgregarClick={() => {}}
        showNotifications={false}
        onNotificationsClick={() => {}}
        propiedades={propiedades}
        selectedPropiedadId={selectedPropiedadId}
        onSelectPropiedad={handleSelectPropiedad}
        stats={stats}
      />

      {!selectedPropiedadId || chats.length === 0 ? (
        <div className="empty-state" style={{ flex: 1, overflow: 'auto' }}>
          <Empty
            description="Cargando chats y actividades..."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="oportunidades-content" style={{ flex: 1 }}>
          <div className="brigada-column">
            <BrigadaActivityFeed />
          </div>
          <div className="chats-column">
            <WhatsAppChatArea />
          </div>
        </div>
      )}
    </div>
  );
};

export default Oportunidades;
