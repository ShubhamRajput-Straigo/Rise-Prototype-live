import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  height = 300,
}) => {
  return (
    <Card className={cn('hover:shadow-md transition-shadow duration-200', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div style={{ height: `${height}px`, width: '100%', overflow: 'hidden' }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;