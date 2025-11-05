import { Table, Button, Tag, Space, Tooltip } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import type { GCP_FILES } from '../../types/document';

interface TableRowData {
  key: string;
  file: {
    name: string;
    size: number;
    contentType: string;
    timeCreated: string;
    updated: string;
    etag: string;
    md5Hash: string;
    crc32c: string;
    generation: string;
    metageneration: string;
    storageClass: string;
    customMetadata?: {
      originalName: string;
      uploadedAt: string;
      documentType: string;
    };
  };
  signedUrl: string;
}

interface Props {
  data: GCP_FILES | null;
  loading: boolean;
}

const ReportesTable = ({ data, loading }: Props) => {
  const handleView = (signedUrl: string) => {
    // Open document in new tab for viewing
    window.open(signedUrl, '_blank');
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileTextOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileTextOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileTextOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const formatFileName = (fileName: string) => {
    // Remove file extension for display
    return fileName.replace(/\.[^/.]+$/, '');
  };

  // Transform data for table display with proper null safety
  const tableData: TableRowData[] = data?.files?.map((file, index) => ({
    key: `${file.name}-${index}`,
    file,
    signedUrl: data.signedUrls?.[file.name] || '',
  })) || [];

  const columns = [
    {
      title: 'Documento',
      dataIndex: 'file',
      render: (file: TableRowData['file']) => (
        <div className="d-flex align-center gap-8">
          {getFileTypeIcon(file.name)}
          <div>
            <div className="font-medium">{formatFileName(file.name)}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{file.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tipo de Archivo',
      dataIndex: 'file',
      render: (file: TableRowData['file']) => {
        const extension = file.name.split('.').pop()?.toUpperCase();
        return <Tag color="default">{extension || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Tamaño',
      dataIndex: 'file',
      render: (file: TableRowData['file']) => {
        const sizeInKB = Math.round(file.size / 1024);
        const sizeInMB = sizeInKB > 1024 ? (sizeInKB / 1024).toFixed(1) + ' MB' : sizeInKB + ' KB';
        return <span style={{ color: '#8c8c8c' }}>{sizeInMB}</span>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: unknown, record: TableRowData) => (
        <Space>
          <Tooltip title="Ver documento">
            <Button icon={<EyeOutlined />} type="text" onClick={() => handleView(record.signedUrl)}>
              Ver
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-16">
      <Table
        id="reportes-table"
        dataSource={tableData}
        columns={columns}
        loading={loading}
        rowKey={record => record.key}
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} documentos`,
        }}
      />
    </div>
  );
};

export default ReportesTable;
