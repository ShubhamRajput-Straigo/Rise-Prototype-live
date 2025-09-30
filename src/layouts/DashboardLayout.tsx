import React from 'react';
import GlobalFilterBar from '@/components/GlobalFilterBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <GlobalFilterBar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;