import React from 'react';
import { Button } from 'antd';
import type { LucideIcon } from 'lucide-react';

interface CommonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'middle' | 'large';
  icon?: LucideIcon;
  iconPosition?: 'start' | 'end';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'middle',
  icon: Icon,
  iconPosition = 'start',
  onClick,
  disabled = false,
  loading = false,
  block = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) => {
  const renderIcon = () => {
    if (!Icon) return null;
    return <Icon size={size === 'large' ? 20 : size === 'small' ? 14 : 16} />;
  };

  return (
    <Button
      type="default"
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      block={block}
      className={`common-button common-button-${variant} ${className}`}
      style={style}
      htmlType={type}
      {...props}
    >
      {iconPosition === 'start' && renderIcon()}
      <span>{children}</span>
      {iconPosition === 'end' && renderIcon()}
    </Button>
  );
};

export default CommonButton;