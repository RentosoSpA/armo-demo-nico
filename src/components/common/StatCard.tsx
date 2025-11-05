import { Card, Typography, Skeleton } from 'antd';
import './StatCard.scss';

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  borderColor: string;
  footer?: React.ReactNode;
  footerText?: string;
  footerType?: 'success' | 'secondary' | 'warning' | 'danger';
  loading?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const StatCard = ({
  title,
  value,
  borderColor,
  footer,
  footerText,
  footerType = 'secondary',
  loading = false,
  style,
  className,
}: StatCardProps) => {
  return (
    <Card
      className={`stat-card ${className || ''}`}
      style={{
        border: `1.5px solid ${borderColor}`,
        ...style,
      }}
    >
      <div className="stat-card__content">
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <>
            <Text strong className="stat-card__title">
              {title}
            </Text>
            <Title level={4} className="stat-card__value">
              {value}
            </Title>
            {footerText && (
              <Text type={footerType} className="stat-card__footer-text">
                {footerText}
              </Text>
            )}
            {footer && footer}
          </>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
