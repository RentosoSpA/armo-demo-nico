import React from 'react';
import { Button, Space } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import '../../styles/components/_view-toggle.scss';

export interface ViewToggleOption {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface ViewToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: ViewToggleOption[];
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  value,
  onChange,
  options,
  className = ''
}) => {
  return (
    <>
      <style>
        {`
          .view-toggle.ant-space-compact .ant-btn {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #9CA3AF !important;
            box-shadow: none !important;
            text-shadow: none !important;
            border-radius: 0 !important;
          }
          .view-toggle.ant-space-compact .ant-btn:first-child {
            border-top-left-radius: 8px !important;
            border-bottom-left-radius: 8px !important;
          }
          .view-toggle.ant-space-compact .ant-btn:last-child {
            border-top-right-radius: 8px !important;
            border-bottom-right-radius: 8px !important;
          }
          .view-toggle.ant-space-compact .ant-btn:hover {
            background: transparent !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
            color: #ffffff !important;
            box-shadow: none !important;
          }
          .view-toggle.ant-space-compact .ant-btn.ant-btn-primary {
            background: transparent !important;
            border-color: #33F491 !important;
            color: #33F491 !important;
            box-shadow: none !important;
          }
          .view-toggle.ant-space-compact .ant-btn.ant-btn-primary:hover {
            background: transparent !important;
            border-color: #33F491 !important;
            color: #33F491 !important;
            box-shadow: none !important;
          }
          .view-toggle.ant-space-compact .ant-btn:focus {
            background: transparent !important;
            border-color: #33F491 !important;
            color: #33F491 !important;
            box-shadow: 0 0 0 2px rgba(51, 244, 145, 0.2) !important;
          }
          .view-toggle.ant-space-compact .ant-btn:active {
            background: transparent !important;
            border-color: #33F491 !important;
            color: #33F491 !important;
            box-shadow: none !important;
          }
          .view-toggle.ant-space-compact .ant-btn.ant-btn-primary:focus {
            background: transparent !important;
            border-color: #33F491 !important;
            color: #33F491 !important;
            box-shadow: 0 0 0 2px rgba(51, 244, 145, 0.2) !important;
          }
          .view-toggle.ant-space-compact .ant-btn.ant-btn-primary:active {
            background: transparent !important;
            border-color: #33F491 !important;
            color: #33F491 !important;
            box-shadow: none !important;
          }
        `}
      </style>
      <Space.Compact className={`view-toggle ${className}`}>
        {options.map((option) => (
          <Button
            key={option.key}
            icon={option.icon}
            type={value === option.key ? 'primary' : 'default'}
            onClick={() => onChange(option.key)}
          >
            {option.label}
          </Button>
        ))}
      </Space.Compact>
    </>
  );
};

// Predefined option sets for common use cases
export const kanbanListOptions: ViewToggleOption[] = [
  {
    key: 'kanban',
    label: 'Kanban',
    icon: <AppstoreOutlined />
  },
  {
    key: 'list',
    label: 'Lista',
    icon: <UnorderedListOutlined />
  }
];

export const cardsTableOptions: ViewToggleOption[] = [
  {
    key: 'cards',
    label: 'Tarjetas',
    icon: <AppstoreOutlined />
  },
  {
    key: 'table',
    label: 'Lista',
    icon: <UnorderedListOutlined />
  }
];

export const listCalendarOptions: ViewToggleOption[] = [
  {
    key: 'list',
    label: 'Lista',
    icon: <UnorderedListOutlined />
  },
  {
    key: 'calendar',
    label: 'Calendario',
    icon: <AppstoreOutlined />
  }
];

export const viewEditOptions: ViewToggleOption[] = [
  {
    key: 'view',
    label: 'Ver',
    icon: <EyeOutlined />
  },
  {
    key: 'edit',
    label: 'Editar',
    icon: <EditOutlined />
  }
];

export default ViewToggle;