import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  className,
  size = 'large',
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      // Handle currency formatting for negative numbers
      if (val < -1000000) {
        return `($${Math.abs(val).toLocaleString()})`;
      } else if (val > 1000000) {
        return `$${val.toLocaleString()}`;
      } else if (val < 0) {
        return `(${Math.abs(val)}%)`;
      } else {
        return `${val}%`;
      }
    }
    return val;
  };

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const textSizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow duration-200', className)}>
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          'text-sm font-medium text-gray-600',
          size === 'small' && 'text-xs'
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={sizeClasses[size]}>
        <div className={cn(
          'font-bold text-gray-900 mb-2',
          textSizeClasses[size],
          trend === 'down' && typeof value === 'number' && value < 0 && 'text-red-600'
        )}>
          {formatValue(value)}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <div className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2',
            trend === 'up' && 'bg-green-100 text-green-800',
            trend === 'down' && 'bg-red-100 text-red-800',
            trend === 'neutral' && 'bg-gray-100 text-gray-800'
          )}>
            {trend === 'up' && '↗'} {trend === 'down' && '↘'} {trend === 'neutral' && '→'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;