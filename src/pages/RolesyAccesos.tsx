import React, { useState, useEffect } from 'react';
import { Card, Select, Tabs, Button, Typography, Switch, Table, App } from 'antd';
import { UserPlus } from 'lucide-react';
import { getProfilesByEmpresa, type ProfileWithRole } from '../services/profiles/profilesServiceSupabase';
import {
  getPermissionsByProfile,
  savePermissions,
  getRolePreset,
  getModuleLabels,
  type PermissionMatrix,
  type Role,
  type ModuleKey,
  type Perm
} from '../services/mock/permissionsServiceMock';
import InviteUserModal from '../components/ajustes/InviteUserModal';
import InvitationLinksManager from '../components/invitations/InvitationLinksManager';
import { useEmpresaStore } from '../store/empresaStore';
import '../styles/components/_propiedades.scss';

// Custom styles for the Select component
const selectStyles = `
  .custom-select-usuario .ant-select-selector {
    background-color: #2a3441 !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    color: rgba(255, 255, 255, 0.85) !important;
  }
  
  .custom-select-usuario .ant-select-selection-placeholder {
    color: rgba(255, 255, 255, 0.45) !important;
  }
  
  .custom-select-usuario .ant-select-selection-item {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  
  .custom-select-usuario .ant-select-arrow {
    color: rgba(255, 255, 255, 0.45) !important;
  }
  
  .custom-select-usuario:hover .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  .custom-select-usuario.ant-select-focused .ant-select-selector {
    border-color: #33F491 !important;
    box-shadow: 0 0 0 2px rgba(51, 244, 145, 0.1) !important;
  }
  
  .custom-select-dropdown {
    background-color: #2a3441 !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    z-index: 1050 !important;
    position: fixed !important;
  }
  
  .custom-select-dropdown .ant-select-item {
    background-color: transparent !important;
    color: rgba(255, 255, 255, 0.85) !important;
    border-radius: 4px !important;
    margin: 2px 8px !important;
    padding: 8px 12px !important;
  }
  
  .custom-select-dropdown .ant-select-item:hover {
    background-color: rgba(255, 255, 255, 0.06) !important;
  }
  
  .custom-select-dropdown .ant-select-item-option-selected {
    background-color: #33F491 !important;
    color: #222222 !important;
  }
  
  .custom-select-dropdown .ant-select-item-option-selected:hover {
    background-color: #33F491 !important;
    color: #222222 !important;
  }

  .permissions-table .ant-table-thead > tr > th {
    padding: 12px 16px !important;
    background: rgba(255, 255, 255, 0.04) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .permissions-table .ant-table-tbody > tr > td {
    padding: 14px 16px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .permissions-table .ant-table-tbody > tr:hover > td {
    background: rgba(255, 255, 255, 0.04) !important;
  }
`;

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const RolesyAccesos: React.FC = () => {
  const { empresa } = useEmpresaStore();
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithRole | null>(null);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix | null>(null);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [selectedRole, setSelectedRole] = useState<Role>('viewer');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const { message } = App.useApp();

  const moduleLabels = getModuleLabels();
  const modules: ModuleKey[] = ['dashboard', 'oportunidades', 'propiedades', 'visitas', 'contratos', 'cobros', 'propietarios', 'reportes', 'usuarios', 'integraciones', 'agencia'];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      loadPermissions();
    }
  }, [selectedProfile]);

  const loadProfiles = async () => {
    if (!empresa?.id) {
      console.log('No empresa ID available');
      return;
    }

    try {
      setLoading(true);
      const data = await getProfilesByEmpresa(empresa.id);
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
      message.error('Error al cargar perfiles');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    if (!selectedProfile) return;
    
    try {
      setLoading(true);
      const permissions = await getPermissionsByProfile(selectedProfile.id);
      
      if (permissions) {
        setPermissionMatrix(permissions);
        setActiveTab('custom');
      } else {
        // Initialize with role preset
        const preset = getRolePreset(selectedProfile.role);
        setPermissionMatrix(preset);
        setSelectedRole(selectedProfile.role);
        setActiveTab('preset');
      }
    } catch (error) {
      message.error('Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    const preset = getRolePreset(role);
    setPermissionMatrix(preset);
  };

  const handlePermissionChange = (module: ModuleKey, permission: keyof Perm, value: boolean) => {
    if (!permissionMatrix) return;
    
    const newMatrix = {
      ...permissionMatrix,
      [module]: {
        ...permissionMatrix[module],
        [permission]: value
      }
    };
    
    setPermissionMatrix(newMatrix);
    
    // Switch to custom tab if changing individual permissions
    if (activeTab === 'preset') {
      setActiveTab('custom');
    }
  };

  const handleColumnToggle = (permission: keyof Perm) => {
    if (!permissionMatrix) return;
    
    // Check if all modules have this permission enabled
    const allEnabled = modules.every(module => permissionMatrix[module][permission]);
    const newValue = !allEnabled;
    
    const newMatrix = { ...permissionMatrix };
    modules.forEach(module => {
      newMatrix[module] = {
        ...newMatrix[module],
        [permission]: newValue
      };
    });
    
    setPermissionMatrix(newMatrix);
    setActiveTab('custom');
  };

  const handleSave = async () => {
    if (!selectedProfile || !permissionMatrix) return;
    
    try {
      setSaving(true);
      await savePermissions(selectedProfile.id, permissionMatrix);
      message.success('Permisos guardados correctamente');
    } catch (error) {
      message.error('Error al guardar permisos');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedProfile) {
      loadPermissions();
    }
  };

  const handleInviteUser = () => {
    setInviteModalVisible(true);
  };

  const columns = [
    {
      title: 'Módulo',
      dataIndex: 'module',
      key: 'module',
      fixed: 'left' as const,
      width: 200,
      render: (module: ModuleKey) => (
        <Text strong>{moduleLabels[module]}</Text>
      ),
    },
    {
      title: (
        <div className="text-center">
          <div>Crear</div>
          <Switch 
            size="small" 
            checked={permissionMatrix ? modules.every(m => permissionMatrix[m].create) : false}
            onChange={() => handleColumnToggle('create')}
            disabled={activeTab === 'preset'}
          />
        </div>
      ),
      dataIndex: 'create',
      key: 'create',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: { module: ModuleKey }) => (
        <Switch 
          checked={permissionMatrix?.[record.module]?.create || false}
          onChange={(checked) => handlePermissionChange(record.module, 'create', checked)}
          disabled={activeTab === 'preset'}
        />
      ),
    },
    {
      title: (
        <div className="text-center">
          <div>Leer</div>
          <Switch 
            size="small" 
            checked={permissionMatrix ? modules.every(m => permissionMatrix[m].read) : false}
            onChange={() => handleColumnToggle('read')}
            disabled={activeTab === 'preset'}
          />
        </div>
      ),
      dataIndex: 'read',
      key: 'read',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: { module: ModuleKey }) => (
        <Switch 
          checked={permissionMatrix?.[record.module]?.read || false}
          onChange={(checked) => handlePermissionChange(record.module, 'read', checked)}
          disabled={activeTab === 'preset'}
        />
      ),
    },
    {
      title: (
        <div className="text-center">
          <div>Actualizar</div>
          <Switch 
            size="small" 
            checked={permissionMatrix ? modules.every(m => permissionMatrix[m].update) : false}
            onChange={() => handleColumnToggle('update')}
            disabled={activeTab === 'preset'}
          />
        </div>
      ),
      dataIndex: 'update',
      key: 'update',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: { module: ModuleKey }) => (
        <Switch 
          checked={permissionMatrix?.[record.module]?.update || false}
          onChange={(checked) => handlePermissionChange(record.module, 'update', checked)}
          disabled={activeTab === 'preset'}
        />
      ),
    },
    {
      title: (
        <div className="text-center">
          <div>Eliminar</div>
          <Switch 
            size="small" 
            checked={permissionMatrix ? modules.every(m => permissionMatrix[m].delete) : false}
            onChange={() => handleColumnToggle('delete')}
            disabled={activeTab === 'preset'}
          />
        </div>
      ),
      dataIndex: 'delete',
      key: 'delete',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: { module: ModuleKey }) => (
        <Switch 
          checked={permissionMatrix?.[record.module]?.delete || false}
          onChange={(checked) => handlePermissionChange(record.module, 'delete', checked)}
          disabled={activeTab === 'preset'}
        />
      ),
    },
  ];

  const dataSource = modules.map(module => ({
    key: module,
    module
  }));

  return (
    <div style={{ padding: '0 16px 24px 16px' }}>
      <style>{selectStyles}</style>
      
      {/* Header Section */}
      <div className="mb-24">
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ flex: '1 1 auto', minWidth: '300px' }}>
            <Title level={2} className="title-text mb-0">
              Usuarios y roles
            </Title>
            <div className="paragraph-text paragraph-secondary" style={{ marginTop: '8px' }}>
              Asigna permisos por módulo a cada miembro de tu inmobiliaria.
            </div>
          </div>
          <Button
            type="primary"
            icon={<UserPlus size={16} />}
            onClick={handleInviteUser}
            className="agregar-propiedad-btn"
          >
            Invitar a un usuario
          </Button>
        </div>
      </div>

      <div className="d-flex flex-column gap-24">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isDesktop ? '1fr 2fr' : '1fr', 
          gap: '24px' 
        }}>
          {/* User Selection Card */}
          <Card
            title="Información general"
            className="modern-card"
            style={{ height: 'fit-content', overflow: 'visible' }}
            styles={{
              body: {
                padding: isDesktop ? '24px' : '16px',
                overflow: 'visible'
              }
            }}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isDesktop ? '16px' : '12px' 
            }}>
              <div>
                <label className="d-block font-medium mb-8">
                  Usuario
                </label>
                <Select
                  placeholder="Seleccionar usuario"
                  loading={loading}
                  value={selectedProfile?.id}
                  onChange={(value) => {
                    const profile = profiles.find(p => p.id === value);
                    setSelectedProfile(profile || null);
                  }}
                  popupMatchSelectWidth={false}
                  className="w-full custom-select-usuario"
                  getPopupContainer={() => document.body}
                  dropdownStyle={{ zIndex: 1050 }}
                >
                  {profiles.map(profile => (
                    <Select.Option key={profile.id} value={profile.id}>
                      <div>
                        <div className="font-medium">{profile.full_name}</div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {selectedProfile && (
                <>
                  <div>
                    <label className="d-block font-medium mb-8">
                      Nombre
                    </label>
                    <div className="p-12">
                      {selectedProfile.full_name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="d-block font-medium mb-8">
                      Email
                    </label>
                    <div className="p-12">
                      {selectedProfile.user_id}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Permissions Card */}
          {selectedProfile && (
            <Card
              title="Rol y accesos"
              className="modern-card"
              styles={{
                body: {
                  padding: isDesktop ? '24px' : '16px'
                }
              }}
            >
              <div style={{ 
                padding: isDesktop ? '0 0 16px 0' : '0 0 12px 0' 
              }}>
                <Tabs 
                  activeKey={activeTab} 
                  onChange={(key) => setActiveTab(key as 'preset' | 'custom')}
                  style={{ marginBottom: isDesktop ? '24px' : '16px' }}
                >
                  <TabPane tab="Rol predeterminado" key="preset">
                    <div style={{ 
                      marginBottom: '16px',
                      padding: isDesktop ? '16px 0' : '12px 0'
                    }}>
                      <Select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        style={{ width: 200 }}
                      >
                        <Select.Option value="owner">Owner</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="manager">Manager</Select.Option>
                        <Select.Option value="agent">Agente</Select.Option>
                        <Select.Option value="viewer">Lector</Select.Option>
                      </Select>
                    </div>
                  </TabPane>
                  
                  <TabPane tab="Rol personalizado" key="custom">
                    <div style={{ 
                      marginBottom: '16px',
                      padding: isDesktop ? '16px 0' : '12px 0'
                    }}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                        Personaliza los permisos específicos para este usuario
                      </Text>
                    </div>
                  </TabPane>
                </Tabs>
              </div>

              {permissionMatrix && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: isDesktop ? '24px' : '16px',
                  marginTop: '16px'
                }}>
                  <div style={{ 
                    overflowX: 'auto',
                    padding: isDesktop ? '16px' : '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Table
                      columns={columns}
                      dataSource={dataSource}
                      pagination={false}
                      scroll={{ x: 600 }}
                      size="middle"
                      style={{ 
                        backgroundColor: 'transparent'
                      }}
                      className="permissions-table"
                    />
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '12px',
                    paddingTop: isDesktop ? '16px' : '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    marginTop: 'auto'
                  }}>
                    <Button 
                      onClick={handleCancel}
                      style={{ 
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        padding: isDesktop ? '8px 16px' : '6px 12px'
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="primary" 
                      onClick={handleSave}
                      loading={saving}
                      style={{
                        padding: isDesktop ? '8px 16px' : '6px 12px'
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Links de Invitación Section */}
        <Card
          title="Links de Invitación"
          className="modern-card"
          style={{ marginTop: '24px' }}
          styles={{
            body: {
              padding: isDesktop ? '24px' : '16px'
            }
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Genera links de invitación reutilizables para que nuevos agentes se registren en tu empresa.
            </Text>
          </div>
          <InvitationLinksManager />
        </Card>
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
      />
    </div>
  );
};

export default RolesyAccesos;