import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';
import MapVisualization from '@/components/MapVisualization';
import { useRole } from '@/context/RoleContext';
import { useFilter } from '@/context/FilterContext';
import { Api } from '@/lib/api';

const FeatureExecutionPage: React.FC = () => {
  const { user, hasPermission } = useRole();
  const { filters } = useFilter();

  const [kpis, setKpis] = useState<{ featureExecution: number; featureExpectedLocation: number; dayOneReady: number; incrementalGainLoss: number } | null>(null);
  const [featByCat, setFeatByCat] = useState<Array<{ category: string; value: number; color?: string }>>([]);
  const [dayOneReady, setDayOneReady] = useState<Array<{ category: string; value: number; color?: string }>>([]);
  const [incrementalImpact, setIncrementalImpact] = useState<Array<{ category: string; value: number }>>([]);
  const [hierarchyPerformance, setHierarchyPerformance] = useState<Array<{ store: string; performance: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [k, f, d, inc, hier] = await Promise.all([
          Api.getKpis(),
          Api.getFeatureExecutionByCategory(),
          Api.getDayOneReady(),
          Api.getIncrementalImpact(),
          Api.getHierarchyPerformance(),
        ]);
        if (cancelled) return;
        setKpis(k);
        setFeatByCat(f);
        setDayOneReady(d);
        setIncrementalImpact(inc);
        setHierarchyPerformance(hier);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getFilteredData = (data: any[]) => {
    if (user?.role === 'regional' && user.permissions.region) {
      return data.map(item => ({
        ...item,
        value: typeof item.value === 'number' ? item.value * (0.9 + Math.random() * 0.2) : item.value,
      }));
    }
    return data;
  };

  const kpiValues = useMemo(() => {
    if (!kpis) return null;
    return {
      featureExecution: user?.role === 'regional' ? kpis.featureExecution - 5 : kpis.featureExecution,
      featureExpectedLocation: user?.role === 'regional' ? kpis.featureExpectedLocation - 3 : kpis.featureExpectedLocation,
      dayOneReady: user?.role === 'regional' ? kpis.dayOneReady - 3 : kpis.dayOneReady,
      incrementalGainLoss: kpis.incrementalGainLoss,
    };
  }, [kpis, user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-gray-700">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words leading-tight">
              Feature Execution Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 break-words">
              Monitor feature execution performance and compliance metrics
            </p>
            {user?.role === 'regional' && (
              <p className="text-xs sm:text-sm text-teal-600 mt-1 break-words">
                Region: {user.permissions.region}
              </p>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0 mt-2 sm:mt-0">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>
  
        {Object.values(filters).some(f => f !== 'All') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 w-full">
            <h3 className="text-xs sm:text-sm font-medium text-blue-900 mb-2">Applied Filters</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {Object.entries(filters)
                .filter(([, value]) => value !== 'All')
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 break-all max-w-full"
                  >
                    <span className="truncate">{key}: {value}</span>
                  </span>
                ))}
            </div>
          </div>
        )}
  
        {/* KPI Cards - Mobile First Approach */}
        <div className="w-full">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
            {/* First row - always full width on mobile */}
            {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && kpiValues && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="w-full">
                  <KPICard 
                    title="Feature Execution (KSR Instore Audit)" 
                    value={kpiValues.featureExecution} 
                    subtitle="Overall execution rate" 
                  />
                </div>
                <div className="w-full">
                  <KPICard 
                    title="Feature Expected or Better Location" 
                    value={kpiValues.featureExpectedLocation} 
                    subtitle="Location compliance" 
                  />
                </div>
                <div className="w-full sm:col-span-2 lg:col-span-1">
                  <KPICard 
                    title="Day One Ready Expected/Better" 
                    value={kpiValues.dayOneReady} 
                    subtitle="Readiness metric" 
                  />
                </div>
              </div>
            )}
            
            {/* Executive KPI */}
            {hasPermission('canAccessExecutive') && kpiValues && (
              <div className="w-full">
                <KPICard 
                  title="Incremental Gain/Loss" 
                  value={kpiValues.incrementalGainLoss} 
                  trend="down" 
                  subtitle="Financial impact" 
                />
              </div>
            )}
            
            {/* HR KPIs */}
            {hasPermission('canAccessHR') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="w-full">
                  <KPICard 
                    title="Team Performance" 
                    value={87} 
                    subtitle="Execution team rating" 
                    trend="up" 
                  />
                </div>
                <div className="w-full">
                  <KPICard 
                    title="Training Compliance" 
                    value={92} 
                    subtitle="Feature execution training" 
                    trend="up" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Charts Section */}
        <div className="w-full space-y-4 sm:space-y-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full min-w-0">
                <ChartCard title="Feature Execution by Category" height={300}>
                  <div className="w-full h-[300px] min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getFilteredData(featByCat)} 
                        margin={{ top: 20, right: 5, left: 5, bottom: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 10 }} 
                          angle={-45} 
                          textAnchor="end" 
                          height={80} 
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 10 }} width={35} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Execution Rate']} 
                          labelStyle={{ color: '#374151' }} 
                          contentStyle={{ maxWidth: '200px', fontSize: '12px' }} 
                        />
                        <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
  
              <div className="w-full min-w-0">
                <ChartCard title="Feature Expected or Better Location" height={300}>
                  <div className="w-full h-[300px] min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getFilteredData(dayOneReady)} 
                        margin={{ top: 20, right: 5, left: 5, bottom: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 10 }} 
                          angle={-45} 
                          textAnchor="end" 
                          height={80} 
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 10 }} width={35} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Location Rate']} 
                          labelStyle={{ color: '#374151' }} 
                          contentStyle={{ maxWidth: '200px', fontSize: '12px' }} 
                        />
                        <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}
  
          {hasPermission('canAccessHR') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full min-w-0">
                <ChartCard title="Team Execution Performance" height={300}>
                  <div className="w-full h-[300px] min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { team: 'Team A', performance: 89, training: 95 },
                          { team: 'Team B', performance: 84, training: 88 },
                          { team: 'Team C', performance: 92, training: 97 },
                          { team: 'Team D', performance: 78, training: 82 },
                        ]}
                        margin={{ top: 20, right: 15, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="team" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} width={35} />
                        <Tooltip contentStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="performance" fill="#8B5CF6" name="Performance %" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="training" fill="#10B981" name="Training %" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
  
              <div className="w-full min-w-0">
                <ChartCard title="Training Completion Trends" height={300}>
                  <div className="w-full h-[300px] min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', completion: 89 },
                          { month: 'Feb', completion: 92 },
                          { month: 'Mar', completion: 88 },
                          { month: 'Apr', completion: 95 },
                          { month: 'May', completion: 97 },
                          { month: 'Jun', completion: 94 },
                        ]}
                        margin={{ top: 20, right: 15, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} width={35} />
                        <Tooltip contentStyle={{ fontSize: '12px' }} />
                        <Line 
                          type="monotone" 
                          dataKey="completion" 
                          stroke="#8B5CF6" 
                          strokeWidth={3} 
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}
  
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full min-w-0">
                <ChartCard title="Day One Ready Expected or Better Location (Goal 90%)" height={300}>
                  <div className="w-full h-[300px] min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={getFilteredData(dayOneReady)} 
                        margin={{ top: 20, right: 15, left: 5, bottom: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 10 }} 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 10 }} width={35} />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Ready Rate']} 
                          labelStyle={{ color: '#374151' }} 
                          contentStyle={{ fontSize: '12px' }}
                        />
                        <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
  
              {hasPermission('canAccessExecutive') && (
                <div className="w-full min-w-0">
                  <ChartCard title="Incremental Gain/Loss by Category" height={300}>
                    <div className="w-full h-[300px] min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={incrementalImpact} 
                          margin={{ top: 20, right: 15, left: 5, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fontSize: 10 }} 
                            angle={-45} 
                            textAnchor="end" 
                            height={80}
                          />
                          <YAxis 
                            tick={{ fontSize: 10 }} 
                            tickFormatter={(value) => `$${(value/1000000).toFixed(0)}M`} 
                            width={50}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Impact']} 
                            labelStyle={{ color: '#374151' }} 
                            contentStyle={{ fontSize: '12px' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>
              )}
            </div>
          )}
  
          {hasPermission('canAccessExecutive') && (
            <div className="w-full">
              <ChartCard title="Hierarchy Performance Feature Execution" subtitle="Hierarchy Performance (Top Stores)" height={400}>
                <div className="w-full h-[400px] min-h-0">
                  <div className="overflow-x-auto overflow-y-hidden h-full">
                    <div style={{ minWidth: '600px', height: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={hierarchyPerformance} 
                          layout="horizontal" 
                          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" tick={{ fontSize: 10 }} />
                          <YAxis 
                            dataKey="store" 
                            type="category" 
                            tick={{ fontSize: 9 }} 
                            width={110}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value}%`, 'Performance']} 
                            labelStyle={{ color: '#374151' }} 
                            contentStyle={{ fontSize: '12px' }}
                          />
                          <Bar dataKey="performance" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </ChartCard>
            </div>
          )}
  
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <div className="w-full">
              <ChartCard title="Area Feature Execution Performance" subtitle="Area Hierarchy" height={350}>
                <div className="w-full h-[350px] min-h-0">
                  <MapVisualization />
                </div>
              </ChartCard>
            </div>
          )}
        </div>
  
        {/* Action Items */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 w-full">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-4">
            {user?.role === 'executive' ? 'Executive Action Items' : user?.role === 'regional' ? 'Regional Action Items' : 'HR Action Items'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {hasPermission('canAccessExecutive') && (
              <>
                <div className="border-l-4 border-red-400 bg-red-50 p-3 sm:p-4 w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-red-800">Critical Issue</h4>
                  <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">
                    PWS category showing significant negative impact - immediate review required
                  </p>
                </div>
  
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-3 sm:p-4 w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-yellow-800">Optimization Opportunity</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1 break-words">
                    SEASONAL and BTEC categories performing well - consider expanding allocation
                  </p>
                </div>
  
                <div className="border-l-4 border-green-400 bg-green-50 p-3 sm:p-4 w-full min-w-0 md:col-span-2 xl:col-span-1">
                  <h4 className="text-xs sm:text-sm font-medium text-green-800">Success Metric</h4>
                  <p className="text-xs sm:text-sm text-green-700 mt-1 break-words">
                    Overall execution rate improved 3% from last quarter
                  </p>
                </div>
              </>
            )}
  
            {hasPermission('canAccessRegional') && !hasPermission('canAccessExecutive') && (
              <>
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-3 sm:p-4 w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-yellow-800">Regional Focus</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1 break-words">
                    {user?.permissions.region} region needs improvement in SALTY category execution
                  </p>
                </div>
  
                <div className="border-l-4 border-blue-400 bg-blue-50 p-3 sm:p-4 w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-blue-800">Training Needed</h4>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1 break-words">
                    3 stores below regional average - schedule manager training sessions
                  </p>
                </div>
              </>
            )}
  
            {hasPermission('canAccessHR') && (
              <>
                <div className="border-l-4 border-green-400 bg-green-50 p-3 sm:p-4 w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-green-800">Team Performance</h4>
                  <p className="text-xs sm:text-sm text-green-700 mt-1 break-words">
                    Team C showing excellent execution performance - recognize achievements
                  </p>
                </div>
  
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-3 sm:p-4 w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-yellow-800">Training Alert</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1 break-words">
                    Team D requires additional feature execution training
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureExecutionPage;