import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import { useFilter } from '@/context/FilterContext';
import { BarChart3, TrendingUp, Target,Home as HomeIcon, Users, Building2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import KPICard from '@/components/KPICard';
import { fetchJson } from '@/lib/api';

// TypeScript interfaces
interface User {
  name?: string;
  id?: string;
  role?: string;
}

interface KPIData {
  totalRevenue: number;
  featureExecution: number;
  storeCount: number;
  performanceScore: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

interface Alert {
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
}

const HomePage: React.FC = () => {
  const { user } = useRole() as { user: User | null };
  const { filters } = useFilter();
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'All') params.append(key, value);
        });
        const url = `/api/kpis${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await fetchJson<KPIData>(url);
        if (!cancelled) setKpis(data);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to load KPIs';
        if (!cancelled) setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    load();
    return () => { 
      cancelled = true; 
    };
  }, [filters]);

  const quickActions: QuickAction[] = [
    {
      title: 'View Summary',
      description: 'Get an overview of all key metrics and performance indicators',
      icon: BarChart3,
      href: '/summary',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Feature Execution',
      description: 'Monitor feature execution performance and compliance metrics',
      icon: Target,
      href: '/feature-execution',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'OSA Dashboard',
      description: 'Track on-shelf availability and inventory management',
      icon: Package,
      href: '#',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const recentAlerts: Alert[] = [
    {
      type: 'warning',
      title: 'Inventory Alert',
      message: '15 stores reporting low inventory levels in SEASONAL category',
      time: '2 hours ago',
    },
    {
      type: 'success',
      title: 'Performance Milestone',
      message: 'KUSA Region exceeded monthly execution target by 12%',
      time: '4 hours ago',
    },
    {
      type: 'info',
      title: 'Training Update',
      message: 'New compliance training module available for all managers',
      time: '1 day ago',
    },
  ];

  const getAlertColor = (type: Alert['type']): string => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 p-4 sm:p-6 lg:p-8">
        <div className="text-gray-700 text-base sm:text-lg">Loading dashboard…</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96 p-4 sm:p-6 lg:p-8">
        <div className="text-red-600 text-sm sm:text-base text-center max-w-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Header - Fully Responsive */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-teal-100 text-sm sm:text-base lg:text-lg break-words">
              Here's your CPG performance overview for today
            </p>
            <p className="text-teal-200 text-xs sm:text-sm mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <HomeIcon className="h-12 w-12 sm:h-16 sm:w-16 lg:h-24 lg:w-24 text-teal-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Key Performance Indicators - Enhanced Responsive Grid */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Today's Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard
            title="Total Revenue"
            value={kpis ? `$${(kpis.totalRevenue / 1000000).toFixed(1)}M` : '--'}
            subtitle="Monthly revenue"
            trend="up"
          />
          <KPICard
            title="Execution Rate"
            value={kpis?.featureExecution ? `${kpis.featureExecution.toFixed(1)}%` : '--'}
            subtitle="Overall execution"
            trend="up"
          />
          <KPICard
            title="Active Stores"
            value={kpis?.storeCount ? kpis.storeCount.toLocaleString() : '--'}
            subtitle="Reporting locations"
          />
          <KPICard
            title="Performance Score"
            value={kpis?.performanceScore ? kpis.performanceScore.toFixed(1) : '--'}
            subtitle="Out of 10.0"
            trend="up"
          />
        </div>
      </div>

      {/* Quick Actions - Enhanced Mobile Layout */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <CardTitle className="text-base sm:text-lg break-words">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  <p className="text-gray-600 text-sm sm:text-base break-words">{action.description}</p>
                  <Link to={action.href} className="block">
                    <Button className="w-full group-hover:bg-teal-600 transition-colors duration-200 text-sm sm:text-base">
                      Access Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Alerts & Quick Stats - Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Alerts */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Alerts</h2>
          <div className="space-y-3 sm:space-y-4">
            {recentAlerts.map((alert, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getAlertColor(alert.type)}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">{alert.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats - Enhanced Mobile Layout */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Stats</h2>
          <div className="space-y-3 sm:space-y-4">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">Top Performing Region</h4>
                    <p className="text-lg sm:text-2xl font-bold text-teal-600 mt-1 break-words">WM Region</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">87% execution rate</p>
                  </div>
                  <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-teal-500 opacity-50 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">Best Category</h4>
                    <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1 break-words">SEASONAL</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">92% compliance</p>
                  </div>
                  <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 opacity-50 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">Active Users</h4>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-1 break-words">
                      {kpis?.storeCount ? kpis.storeCount.toLocaleString() : '--'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">Online now</p>
                  </div>
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 opacity-50 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;