import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Line, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Api } from '@/lib/api';

const SummaryPage: React.FC = () => {
  const [summaryKpis, setSummaryKpis] = useState<{ overallExecution: number; revenueGrowth: number; storeCompliance: number; inventoryTurnover: number }>({ overallExecution: 0, revenueGrowth: 0, storeCompliance: 0, inventoryTurnover: 0 });
  const [monthlyTrends, setMonthlyTrends] = useState<Array<{ month: string; execution: number; revenue: number; compliance: number }>>([]);
  const [regionPerformance, setRegionPerformance] = useState<Array<{ region: string; execution: number; revenue: number; stores: number }>>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [topIssues, setTopIssues] = useState<Array<{ issue: string; count: number; severity: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [monthly, regions, categories, issues] = await Promise.all([
          Api.getSummaryMonthly(),
          Api.getSummaryRegions(),
          Api.getSummaryCategories(),
          Api.getSummaryTopIssues(),
        ]);
        if (cancelled) return;
        setMonthlyTrends(monthly);
        setRegionPerformance(regions);
        setCategoryBreakdown(categories);
        setTopIssues(issues);
        // derive simple kpis from data
        const overallExecution = Math.round(monthly.reduce((a, b) => a + (b.execution || 0), 0) / (monthly.length || 1));
        const revenueGrowth = monthly.length >= 2 ? Number((monthly[monthly.length - 1].revenue - monthly[monthly.length - 2].revenue).toFixed(1)) : 0;
        const storeCompliance = Math.round(monthly.reduce((a, b) => a + (b.compliance || 0), 0) / (monthly.length || 1));
        const inventoryTurnover = 0;
        setSummaryKpis({ overallExecution, revenueGrowth, storeCompliance, inventoryTurnover });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load summary');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'medium': return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'low': return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-teal-600 mx-auto"></div>
        <div className="text-gray-700 text-sm sm:text-base">Loading summary…</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto" />
        <div className="text-red-600 text-sm sm:text-base">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header Section - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                Executive Summary
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                Comprehensive overview of all CPG performance metrics
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              Last Updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* KPI Cards - Fully responsive grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <KPICard title="Overall Execution Rate" value={summaryKpis.overallExecution} subtitle="Across all regions" trend="up" />
            <KPICard title="Revenue Growth" value={`${summaryKpis.revenueGrowth}%`} subtitle="Month over month" trend="up" />
            <KPICard title="Store Compliance" value={summaryKpis.storeCompliance} subtitle="Meeting standards" trend="neutral" />
            <KPICard title="Inventory Turnover" value={summaryKpis.inventoryTurnover.toFixed(1)} subtitle="Times per year" trend="up" />
          </div>

          {/* Main Charts Section - Responsive layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <ChartCard title="6-Month Performance Trends" height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={monthlyTrends} 
                  margin={{ 
                    top: 15, 
                    right: 10, 
                    left: 10, 
                    bottom: 15 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }} 
                    height={35}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      maxWidth: '180px', 
                      fontSize: '11px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="execution" fill="#14B8A6" name="Execution %" radius={[2, 2, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    name="Revenue ($M)" 
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Revenue by Category" height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryBreakdown} 
                    cx="50%" 
                    cy="45%" 
                    outerRadius={70}
                    innerRadius={30} 
                    paddingAngle={2} 
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{
                      fontSize: '11px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {categoryBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 text-xs truncate">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Regional Performance - Full width */}
          <ChartCard title="Regional Performance Overview" height={320}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={regionPerformance} 
                margin={{ 
                  top: 15, 
                  right: 10, 
                  left: 10, 
                  bottom: 50 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="region" 
                  tick={{ fontSize: 10 }} 
                  angle={-45} 
                  textAnchor="end" 
                  height={50} 
                  interval={0} 
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  width={40} 
                />
                <Tooltip 
                  contentStyle={{ 
                    maxWidth: '180px', 
                    fontSize: '11px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Bar dataKey="execution" fill="#14B8A6" name="Execution %" radius={[3, 3, 0, 0]} />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($M)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Issues and Insights - Responsive layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Issues Card */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <span className="truncate">Top Issues Requiring Attention</span>
              </h3>
              <div className="space-y-3">
                {topIssues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-1 rounded-full flex-shrink-0 ${getSeverityColor(issue.severity)}`}>
                        {getSeverityIcon(issue.severity)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{issue.issue}</h4>
                        <p className="text-xs text-gray-600">{issue.count} events</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getSeverityColor(issue.severity)}`}>
                      {issue.severity.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="truncate">Key Insights & Recommendations</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="border-l-4 border-green-400 bg-green-50 p-3 sm:p-4 rounded-r-lg">
                  <h4 className="text-xs sm:text-sm font-medium text-green-800">Strong Performance</h4>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">Top region leading execution rate - share best practices</p>
                </div>
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-3 sm:p-4 rounded-r-lg">
                  <h4 className="text-xs sm:text-sm font-medium text-yellow-800">Improvement Opportunity</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1">Strong category performance - consider expanding allocation</p>
                </div>
                <div className="border-l-4 border-blue-400 bg-blue-50 p-3 sm:p-4 rounded-r-lg">
                  <h4 className="text-xs sm:text-sm font-medium text-blue-800">Action Required</h4>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">Inventory shortage alerts - review supply chain</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics - Enhanced responsiveness */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-teal-600">
                  {regionPerformance.reduce((a, b) => a + (b.stores || 0), 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Records</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  ${monthlyTrends.reduce((a, b) => a + (b.revenue || 0), 0).toFixed(1)}M
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Revenue Sum</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{summaryKpis.overallExecution}%</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg Execution</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{summaryKpis.storeCompliance}%</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;