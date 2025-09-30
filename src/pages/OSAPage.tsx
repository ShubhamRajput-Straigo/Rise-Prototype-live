import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';
import { useRole } from '@/context/RoleContext';
import { useFilter } from '@/context/FilterContext';
import { Package, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Api } from '@/lib/api';

const OSAPage: React.FC = () => {
  const { user, hasPermission } = useRole();
  const { filters } = useFilter();

  const [kpis, setKpis] = useState<{ overallOSA: number | null; outOfStockRate: number | null; replenishmentSpeed: number | null; inventoryTurnover: number | null } | null>(null);
  const [osaByCategory, setOsaByCategory] = useState<Array<{ category: string; osa: number; outOfStock: number; replenishment: number | null}>>([]);
  const [regionalOSA, setRegionalOSA] = useState<Array<{ region: string; osa: number; stores: number; criticalOOS: number }>>([]);
  const [inventoryHealth] = useState<Array<{ metric: string; percentage: number; color: string }>>([
    { metric: 'Optimal', percentage: 60, color: '#10B981' },
    { metric: 'Low Stock', percentage: 25, color: '#F59E0B' },
    { metric: 'Out of Stock', percentage: 15, color: '#EF4444' },
  ]);
  const [osatrends, setOsatrends] = useState<Array<{ week: string; osa: number; outOfStock: number; alerts: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has HR-related permissions (safe check)
  const hasHRAccess = useMemo(() => {
    try {
      return hasPermission('canAccessHR' as any);
    } catch {
      return user?.role === 'hr' || user?.role === 'admin' || false;
    }
  }, [hasPermission, user]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [k, byCat, regional] = await Promise.all([
          Api.getOsaKpis(),
          Api.getOsaByCategory(),
          Api.getOsaRegional(),
        ]);
        if (cancelled) return;
        setKpis(k);
        setOsaByCategory(byCat);
        setRegionalOSA(regional);
        // Build a simple trend from byCategory as placeholder (if no weekly endpoint yet)
        setOsatrends(byCat.slice(0, 6).map((d, i) => ({ week: `W${i + 1}`, osa: d.osa, outOfStock: d.outOfStock, alerts: Math.max(5, Math.round(d.outOfStock / 2)) })));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load OSA data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical OOS': return 'text-red-600 bg-red-100';
      case 'Low Stock': return 'text-yellow-600 bg-yellow-100';
      case 'Overstock': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-700 text-lg">Loading OSA Dashboard...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const overallOSA = user?.role === 'regional' && kpis?.overallOSA != null ? kpis.overallOSA - 1.5 : kpis?.overallOSA ?? 0;
  const outOfStockRate = user?.role === 'regional' && kpis?.outOfStockRate != null ? kpis.outOfStockRate + 1 : kpis?.outOfStockRate ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              On-Shelf Availability (OSA) Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Monitor inventory levels, stock availability, and replenishment performance
            </p>
            {user?.role === 'regional' && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                Region: {user.permissions.region}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:items-end text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {Object.values(filters).some(f => f !== 'All') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Applied Filters</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters)
                .filter(([, value]) => value !== 'All')
                .map(([key, value]) => (
                  <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {key}: {value}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <>
              <KPICard 
                title="Overall OSA" 
                value={`${overallOSA.toFixed(1)}%`} 
                subtitle="On-shelf availability" 
                trend="up" 
              />
              <KPICard 
                title="Out of Stock Rate" 
                value={`${(outOfStockRate).toFixed(1)}%`} 
                subtitle="Items out of stock" 
                trend="down" 
              />
              <KPICard 
                title="Replenishment Speed" 
                value={kpis?.replenishmentSpeed ? `${kpis.replenishmentSpeed.toFixed(1)}h` : '—'} 
                subtitle="Average restock time" 
                trend="neutral" 
              />
            </>
          )}
          {hasPermission('canAccessExecutive') && (
            <KPICard 
              title="Inventory Turnover" 
              value={kpis?.inventoryTurnover ? kpis.inventoryTurnover.toFixed(1) : '—'} 
              subtitle="Times per year" 
              trend="up" 
            />
          )}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <>
              <ChartCard title="OSA Performance by Category" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={osaByCategory} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 11 }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      interval={0} 
                    />
                    <YAxis tick={{ fontSize: 11 }} width={50} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [ 
                        `${name === 'osa' ? value : value}%`, 
                        name === 'osa' ? 'OSA Rate' : name === 'outOfStock' ? 'Out of Stock' : 'Replenishment Time (h)' 
                      ]} 
                      contentStyle={{ maxWidth: '200px', fontSize: '12px' }} 
                    />
                    <Bar dataKey="osa" fill="#10B981" name="osa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outOfStock" fill="#EF4444" name="outOfStock" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="6-Week OSA Trends" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={osatrends} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} height={40} />
                    <YAxis tick={{ fontSize: 11 }} width={50} />
                    <Tooltip contentStyle={{ maxWidth: '200px', fontSize: '12px' }} />
                    <Bar dataKey="osa" fill="#10B981" name="OSA %" radius={[4, 4, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="alerts" 
                      stroke="#EF4444" 
                      strokeWidth={3} 
                      name="Critical Alerts" 
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

          {hasHRAccess && (
            <>
              <ChartCard title="Team Replenishment Performance" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { team: 'Team A', efficiency: 91, accuracy: 95 },
                      { team: 'Team B', efficiency: 88, accuracy: 92 },
                      { team: 'Team C', efficiency: 94, accuracy: 97 },
                      { team: 'Team D', efficiency: 85, accuracy: 89 }
                    ]} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="team" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#14B8A6" name="Efficiency %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="accuracy" fill="#8B5CF6" name="Accuracy %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Staff Training Completion" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={[
                      { month: 'Jan', completion: 87 },
                      { month: 'Feb', completion: 91 },
                      { month: 'Mar', completion: 89 },
                      { month: 'Apr', completion: 94 },
                      { month: 'May', completion: 96 },
                      { month: 'Jun', completion: 93 }
                    ]} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="completion" 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <ChartCard title="Regional OSA Performance" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalOSA} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="region" 
                    tick={{ fontSize: 11 }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [ 
                      name === 'osa' ? `${value}%` : value, 
                      name === 'osa' ? 'OSA Rate' : name === 'stores' ? 'Store Count' : 'Critical OOS' 
                    ]} 
                  />
                  <Bar dataKey="osa" fill="#10B981" name="osa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {hasPermission('canAccessExecutive') && (
            <ChartCard title="Inventory Health Distribution" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={inventoryHealth} 
                    cx="50%" 
                    cy="45%" 
                    outerRadius={80} 
                    innerRadius={30} 
                    paddingAngle={2} 
                    dataKey="percentage"
                  >
                    {inventoryHealth.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {inventoryHealth.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 justify-center sm:justify-start">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 truncate">{item.metric}: {item.percentage}%</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </div>

        {/* Alerts and Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
              Critical OSA Alerts
            </h3>
            <div className="space-y-3">
              {[
                { item: 'Category A', status: 'Critical OOS', duration: '3 days', impact: 'High' },
                { item: 'Category B', status: 'Low Stock', duration: '1 day', impact: 'Medium' }
              ].map((alert, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-gray-100 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-1 rounded-full ${getStatusColor(alert.status)} flex-shrink-0`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{alert.item}</h4>
                      <p className="text-sm text-gray-600">{alert.duration}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)} whitespace-nowrap`}>
                      {alert.status}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(alert.impact)} whitespace-nowrap`}>
                      {alert.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              OSA Insights & Actions
            </h3>
            <div className="space-y-4">
              {hasPermission('canAccessExecutive') && (
                <>
                  <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                    <h4 className="text-sm font-medium text-green-800 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Best Performance
                    </h4>
                    <p className="text-sm text-green-700 mt-1">Top region leading OSA - share best practices</p>
                  </div>
                  <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <h4 className="text-sm font-medium text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Critical Issue
                    </h4>
                    <p className="text-sm text-red-700 mt-1">Critical OOS observed - immediate intervention required</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 rounded-xl p-6 sm:p-8 border border-green-100">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">OSA Performance Summary</h3>
            <p className="text-gray-600 text-sm">Key metrics at a glance</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center bg-white/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                {overallOSA.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Overall OSA</div>
            </div>
            
            <div className="text-center bg-white/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1">
                {kpis?.replenishmentSpeed ? `${kpis.replenishmentSpeed.toFixed(1)}h` : '—'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg Replenishment</div>
            </div>
            
            <div className="text-center bg-white/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">91%</div>
              <div className="text-xs sm:text-sm text-gray-600">Team Efficiency</div>
            </div>
            
            <div className="text-center bg-white/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                {Math.max(0, Math.round((outOfStockRate ?? 0) / 5))}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Critical Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSAPage;