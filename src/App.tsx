import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from '@/context/RoleContext';
import { FilterProvider } from '@/context/FilterContext';
import Sidebar from '@/components/Sidebar';
import DashboardLayout from '@/layouts/DashboardLayout';
import HomePage from '@/pages/HomePage';
import SummaryPage from '@/pages/SummaryPage';
import FeatureExecutionPage from '@/pages/FeatureExecutionPage';
import OSAPage from '@/pages/OSAPage';
import RetailWalletPage from '@/pages/RetailWalletPage';
import SupplyChainPage from '@/pages/SupplyChainPage';
import './App.css';

// App Content Component (needs to be inside Router context)
const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<DashboardLayout><HomePage /></DashboardLayout>} />
          <Route path="/summary" element={<DashboardLayout><SummaryPage /></DashboardLayout>} />
          <Route path="/feature-execution" element={<DashboardLayout><FeatureExecutionPage /></DashboardLayout>} />
          <Route path="/osa" element={<DashboardLayout><OSAPage /></DashboardLayout>} />
          <Route path="/retail-wallet" element={<DashboardLayout><RetailWalletPage /></DashboardLayout>} />
          <Route path="/supply-chain" element={<DashboardLayout><SupplyChainPage /></DashboardLayout>} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <RoleProvider>
      <FilterProvider>
        <Router>
          <AppContent />
        </Router>
      </FilterProvider>
    </RoleProvider>
  );
};

export default App;