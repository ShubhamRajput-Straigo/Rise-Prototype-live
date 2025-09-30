import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { Truck, AlertTriangle, CheckCircle, Filter, X } from 'lucide-react';

// Mock components and hooks for demonstration
const KPICard = ({ title, value, subtitle, trend }: { title: string; value: string; subtitle: string; trend: string }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <div className="mt-1">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{value}</div>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{subtitle}</p>
        </div>
      </div>
      <div className={`ml-2 p-2 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-current"></div>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, height, children }: { title: string; height: number; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h3>
    </div>
    <div className="p-2 sm:p-4" style={{ height: `${height}px` }}>
      {children}
    </div>
  </div>
);

// Mock context hooks
const useRole = () => ({
  user: { role: 'executive', permissions: { region: 'North America' } },
  hasPermission: (_permission: string) => true
});

const useFilter = () => ({
  filters: { region: 'All', department: 'All', timeframe: 'All' }
});

// Mock API
const Api = {
  getSupplyKpis: async () => ({ onTimeDelivery: 94.2, inventoryAccuracy: 97.8, orderFulfillment: 92.5, supplierPerformance: 89.3 }),
  getSupplyDeliveryByCategory: async () => [
    { category: 'Electronics', onTime: 94.5, accuracy: 97.2 },
    { category: 'Furniture', onTime: 89.7, accuracy: 94.8 },
    { category: 'Apparel', onTime: 96.1, accuracy: 98.3 },
    { category: 'Books', onTime: 91.2, accuracy: 95.7 },
    { category: 'Home', onTime: 93.8, accuracy: 96.5 }
  ],
  getSupplyTrends: async () => [
    { week: 'W1', onTime: 92.1, accuracy: 95.8, issues: 12 },
    { week: 'W2', onTime: 94.3, accuracy: 96.2, issues: 8 },
    { week: 'W3', onTime: 93.7, accuracy: 97.1, issues: 10 },
    { week: 'W4', onTime: 95.2, accuracy: 96.8, issues: 6 },
    { week: 'W5', onTime: 94.8, accuracy: 97.5, issues: 7 },
    { week: 'W6', onTime: 96.1, accuracy: 97.9, issues: 5 }
  ],
  getSuppliers: async () => [
    { supplier: 'Supplier A', performance: 94.2, reliability: 96.8 },
    { supplier: 'Supplier B', performance: 89.7, reliability: 92.3 },
    { supplier: 'Supplier C', performance: 96.1, reliability: 98.1 },
    { supplier: 'Supplier D', performance: 87.4, reliability: 90.2 }
  ]
};

interface KPIData {
  onTimeDelivery: number | null;
  inventoryAccuracy: number | null;
  orderFulfillment: number | null;
  supplierPerformance: number | null;
}

interface DeliveryPerformanceData {
  category: string;
  onTime: number;
  accuracy: number;
}

interface TrendData {
  week: string;
  onTime: number;
  accuracy: number;
  issues: number;
}

interface SupplierData {
  supplier: string;
  performance: number;
  reliability: number;
}

interface TransportationMode {
  mode: string;
  percentage: number;
  cost: number;
  reliability: number;
}

interface RiskFactor {
  risk: string;
  impact: string;
  probability: string;
  mitigation: string;
}

const SupplyChainPage: React.FC = () => {
  const { user, hasPermission } = useRole();
  const { filters } = useFilter();

  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [deliveryPerformance, setDeliveryPerformance] = useState<DeliveryPerformanceData[]>([]);
  const [supplyChainTrends, setSupplyChainTrends] = useState<TrendData[]>([]);
  const [supplierPerformance, setSupplierPerformance] = useState<SupplierData[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const transportationModes: TransportationMode[] = [
    { mode: 'Ground', percentage: 65, cost: 2.8, reliability: 94.2 },
    { mode: 'Air', percentage: 15, cost: 8.4, reliability: 97.8 },
    { mode: 'Rail', percentage: 12, cost: 1.9, reliability: 89.3 },
    { mode: 'Ocean', percentage: 8, cost: 1.2, reliability: 85.7 },
  ];

  const riskFactors: RiskFactor[] = [
    { risk: 'Weather Delays', impact: 'Medium', probability: 'High', mitigation: 'Alternative routes' },
    { risk: 'Supplier Disruption', impact: 'High', probability: 'Low', mitigation: 'Backup suppliers' },
    { risk: 'Capacity Constraints', impact: 'Medium', probability: 'Medium', mitigation: 'Flexible scheduling' },
    { risk: 'Quality Issues', impact: 'High', probability: 'Low', mitigation: 'Enhanced QC' },
    { risk: 'Cost Fluctuations', impact: 'Low', probability: 'High', mitigation: 'Contract hedging' },
  ];

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [k, delByCat, trends, suppliers] = await Promise.all([
          Api.getSupplyKpis(),
          Api.getSupplyDeliveryByCategory(),
          Api.getSupplyTrends(),
          Api.getSuppliers(),
        ]);
        if (cancelled) return;
        setKpis(k);
        setDeliveryPerformance(delByCat);
        setSupplyChainTrends(trends);
        setSupplierPerformance(suppliers);
      } catch (e: unknown) {
        const error = e as Error;
        if (!cancelled) setError(error?.message || 'Failed to load Supply Chain data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProbabilityColor = (probability: string): string => {
    switch (probability) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-teal-500 mx-auto"></div>
        <div className="text-gray-700 mt-4 text-sm sm:text-base">Loading Supply Chain…</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="text-red-600 text-sm sm:text-base text-center">{error}</div>
      </div>
    </div>
  );

  const onTimeDelivery = user?.role === 'regional' && kpis?.onTimeDelivery != null ? kpis.onTimeDelivery - 1 : kpis?.onTimeDelivery ?? 0;
  const inventoryAccuracy = user?.role === 'regional' && kpis?.inventoryAccuracy != null ? kpis.inventoryAccuracy - 0.5 : kpis?.inventoryAccuracy ?? 0;
  const orderFulfillment = user?.role === 'regional' && kpis?.orderFulfillment != null ? kpis.orderFulfillment - 1.5 : kpis?.orderFulfillment ?? 0;

  const hasActiveFilters = Object.values(filters).some(f => f !== 'All');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-gray-900 truncate">Supply Chain</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}></div>
          <div className="absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Applied Filters</h4>
                <div className="space-y-2">
                  {Object.entries(filters)
                    .filter(([, value]) => value !== 'All')
                    .map(([key, value]) => (
                      <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        {key}: {value}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-900">Supply Chain Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm xl:text-base">Monitor delivery performance, inventory levels, and supplier metrics</p>
              {user?.role === 'regional' && (
                <p className="text-sm text-teal-600 mt-1">Region: {user.permissions.region}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Applied Filters</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters)
                  .filter(([, value]) => value !== 'All')
                  .map(([key, value]) => (
                    <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {key}: {value}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <>
              <KPICard 
                title="On-Time Delivery" 
                value={`${onTimeDelivery.toFixed(1)}%`} 
                subtitle="Delivery performance" 
                trend="up" 
              />
              <KPICard 
                title="Inventory Accuracy" 
                value={`${inventoryAccuracy ? inventoryAccuracy.toFixed(1) : '—'}%`} 
                subtitle="Stock accuracy" 
                trend="up" 
              />
              <KPICard 
                title="Order Fulfillment" 
                value={`${orderFulfillment.toFixed(1)}%`} 
                subtitle="Complete orders" 
                trend="neutral" 
              />
            </>
          )}
          {hasPermission('canAccessExecutive') && (
            <KPICard 
              title="Supplier Performance" 
              value={`${kpis?.supplierPerformance ? kpis.supplierPerformance.toFixed(1) : '—'}%`} 
              subtitle="Overall supplier rating" 
              trend="up" 
            />
          )}
        </div>

        {/* Charts Grid - First Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <>
              <ChartCard title="Delivery Performance by Category" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryPerformance} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 12 }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} width={60} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'cost' ? `$${value}` : `${value}%`,
                        name === 'onTime' ? 'On-Time Delivery' : name === 'accuracy' ? 'Accuracy' : 'Cost per Unit'
                      ]}
                      contentStyle={{ maxWidth: '200px', fontSize: '12px' }}
                    />
                    <Bar dataKey="onTime" fill="#14B8A6" name="onTime" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="accuracy" fill="#3B82F6" name="accuracy" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="6-Week Supply Chain Trends" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={supplyChainTrends} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} height={40} />
                    <YAxis tick={{ fontSize: 12 }} width={60} />
                    <Tooltip contentStyle={{ maxWidth: '200px', fontSize: '12px' }} />
                    <Bar dataKey="onTime" fill="#14B8A6" name="On-Time %" radius={[4, 4, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#8B5CF6" 
                      strokeWidth={3} 
                      name="Accuracy %" 
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="issues" 
                      stroke="#EF4444" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      name="Issues Count" 
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

          {hasPermission('canAccessHR') && (
            <>
              <ChartCard title="Warehouse Team Performance" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { team: 'Team A', efficiency: 92.1, safety: 98.5 },
                      { team: 'Team B', efficiency: 89.4, safety: 97.2 },
                      { team: 'Team C', efficiency: 94.7, safety: 99.1 },
                      { team: 'Team D', efficiency: 87.8, safety: 96.8 }
                    ]} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#14B8A6" name="Efficiency %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="safety" fill="#8B5CF6" name="Safety Score %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Training & Certification Status" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={[
                      { month: 'Jan', certified: 87, trained: 92 },
                      { month: 'Feb', certified: 89, trained: 94 },
                      { month: 'Mar', certified: 91, trained: 95 },
                      { month: 'Apr', certified: 93, trained: 97 },
                      { month: 'May', certified: 95, trained: 98 },
                      { month: 'Jun', certified: 94, trained: 97 }
                    ]} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="certified" 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      name="Certified %" 
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="trained" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      name="Trained %" 
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}
        </div>

        {/* Charts Grid - Second Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {hasPermission('canAccessExecutive') && (
            <ChartCard title="Supplier Performance Analysis" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="supplier" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'cost' ? `$${value}` : `${value}%`,
                      name === 'performance' ? 'Performance Score' : name === 'reliability' ? 'Reliability' : 'Cost Index'
                    ]}
                  />
                  <Bar dataKey="performance" fill="#14B8A6" name="performance" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reliability" fill="#3B82F6" name="reliability" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <ChartCard title="Distribution Center Inventory Levels" height={350}>
              <div className="text-sm text-gray-500 p-4 flex items-center justify-center h-full">
                Coming soon from warehouse inventory source…
              </div>
            </ChartCard>
          )}
        </div>

        {/* Charts Grid - Third Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
            <ChartCard title="Warehouse Efficiency Metrics" height={350}>
              <div className="text-sm text-gray-500 p-4 flex items-center justify-center h-full">
                Coming soon from warehouse operations source…
              </div>
            </ChartCard>
          )}

          {hasPermission('canAccessExecutive') && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="truncate">Transportation Mode Analysis</span>
              </h3>
              <div className="space-y-4">
                {transportationModes.map((mode, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="font-medium text-gray-900">{mode.mode}</span>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
                        <span className="text-gray-600 whitespace-nowrap">{mode.percentage}%</span>
                        <span className="text-gray-600 whitespace-nowrap">${mode.cost}/unit</span>
                        <span className="text-gray-600 whitespace-nowrap">{mode.reliability}% reliable</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${mode.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Risk Assessment and Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {hasPermission('canAccessExecutive') && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="truncate">Supply Chain Risk Assessment</span>
              </h3>
              <div className="space-y-3">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-1 rounded-full bg-orange-100 text-orange-600 flex-shrink-0">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate">{risk.risk}</h4>
                        <p className="text-sm text-gray-600 truncate">{risk.mitigation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(risk.impact)}`}>
                        {risk.impact}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(risk.probability)}`}>
                        {risk.probability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="truncate">Supply Chain Insights & Actions</span>
            </h3>
            <div className="space-y-4">
              {hasPermission('canAccessExecutive') && (
                <>
                  <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                    <h4 className="text-sm font-medium text-green-800">Supplier Excellence</h4>
                    <p className="text-sm text-green-700 mt-1">Top supplier showing strong performance - consider expanding partnership</p>
                  </div>
                  <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <h4 className="text-sm font-medium text-red-800">Performance Issue</h4>
                    <p className="text-sm text-red-700 mt-1">One supplier underperforming - schedule improvement meeting</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">
            Supply Chain Performance Summary
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-teal-600 truncate">
                {onTimeDelivery.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">On-Time Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
                {inventoryAccuracy ? inventoryAccuracy.toFixed(1) : '—'}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Inventory Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600 truncate">
                {orderFulfillment.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Order Fulfillment</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600 truncate">
                {kpis?.supplierPerformance ? kpis.supplierPerformance.toFixed(1) : '—'}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Supplier Performance</div>
            </div>
          </div>
        </div>

        {/* Mobile-specific Quick Actions */}
        <div className="lg:hidden">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 bg-teal-50 text-teal-700 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors duration-200">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">Track Shipment</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">View Alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainPage;