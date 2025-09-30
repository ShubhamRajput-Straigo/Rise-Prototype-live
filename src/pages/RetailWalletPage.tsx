import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';
import { useRole } from '@/context/RoleContext';
import { useFilter } from '@/context/FilterContext';
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { Api } from '@/lib/api';

const RetailWalletPage: React.FC = () => {
  const { user, hasPermission } = useRole();
  const { filters } = useFilter();

  const [walletKpis, setWalletKpis] = useState<{ totalWalletShare: number | null; walletGrowth: number | null; customerPenetration: number | null; avgWalletSize: number | null } | null>(null);
  const [walletByCategory, setWalletByCategory] = useState<Array<{ category: string; walletShare: number; growth: number; penetration: number }>>([]);
  const [walletTrends, setWalletTrends] = useState<Array<{ month: string; walletShare: number; growth: number; customers: number }>>([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<Array<{ competitor: string; walletShare: number; marketShare: number }>>([]);
  const [customerSegments, setCustomerSegments] = useState<Array<{ segment: string; walletSize: number; penetration: number; growth: number }>>([]);
  const [regionalWallet, setRegionalWallet] = useState<Array<{ region: string; walletShare: number; growth: number; customers: number | null }>>([]);
  const [loyaltyMetrics] = useState<Array<{ metric: string; percentage: number; color: string }>>([
    { metric: 'Highly Loyal', percentage: 28, color: '#10B981' },
    { metric: 'Moderately Loyal', percentage: 45, color: '#14B8A6' },
    { metric: 'Occasional', percentage: 19, color: '#F59E0B' },
    { metric: 'At Risk', percentage: 8, color: '#EF4444' },
  ]);
  const [walletOpportunities] = useState<Array<{ opportunity: string; potential: number; difficulty: 'High' | 'Medium' | 'Low'; timeline: string }>>([
    { opportunity: 'Cross-Category Growth', potential: 15.2, difficulty: 'Medium', timeline: '6 months' },
    { opportunity: 'Premium Segment Expansion', potential: 22.8, difficulty: 'High', timeline: '12 months' },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [kpis, byCat, competitors, regions] = await Promise.all([
          Api.getWalletKpis(),
          Api.getWalletByCategory(),
          Api.getWalletCompetitors(),
          Api.getWalletRegions(),
        ]);
        if (cancelled) return;
        setWalletKpis(kpis);
        setWalletByCategory(byCat);
        setCompetitorAnalysis(competitors);
        setRegionalWallet(regions);
        setCustomerSegments(byCat.slice(0, 6).map(d => ({ segment: d.category, walletSize: d.walletShare, penetration: d.penetration, growth: d.growth })));
        setWalletTrends(byCat.slice(0, 6).map((d, i) => ({ month: `M${i+1}`, walletShare: d.walletShare, growth: d.growth, customers: Math.round((d.penetration || 0) * 100) })));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load account data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div className="space-y-6"><div className="text-gray-700">Loading Account Performance…</div></div>;
  if (error) return <div className="space-y-6"><div className="text-red-600">{error}</div></div>;

  const totalWalletShare = user?.role === 'regional' && walletKpis?.totalWalletShare != null ? walletKpis.totalWalletShare - 1.5 : walletKpis?.totalWalletShare ?? 0;
  const walletGrowth = walletKpis?.walletGrowth ?? 0;
  const customerPenetration = walletKpis?.customerPenetration ?? 0;
  const avgWalletSize = walletKpis?.avgWalletSize ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor wallet share, customer penetration, and growth opportunities</p>
          {user?.role === 'regional' && (
            <p className="text-sm text-teal-600 mt-1">Region: {user.permissions.region}</p>
          )}
        </div>
        <div className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</div>
      </div>

      {Object.values(filters).some(f => f !== 'All') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
          <>
            <KPICard title="Total Wallet Share" value={`${totalWalletShare.toFixed(1)}%`} subtitle="Share of customer wallet" trend="up" />
            <KPICard title="Wallet Growth" value={`${walletGrowth ? walletGrowth.toFixed(1) : '—'}%`} subtitle="Year over year" trend="up" />
            <KPICard title="Customer Penetration" value={`${customerPenetration ? customerPenetration.toFixed(1) : '—'}%`} subtitle="Market penetration" trend="up" />
          </>
        )}
        {hasPermission('canAccessExecutive') && (
          <KPICard title="Avg Wallet Size" value={avgWalletSize ? `$${avgWalletSize.toFixed(2)}` : '—'} subtitle="Per customer" trend="up" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
          <>
            <ChartCard title="Wallet Share by Category" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={walletByCategory} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} width={60} />
                  <Tooltip formatter={(value: number, name: string) => [ `${value}%`, name === 'walletShare' ? 'Wallet Share' : name === 'growth' ? 'Growth Rate' : 'Penetration' ]} contentStyle={{ maxWidth: '200px', fontSize: '12px' }} />
                  <Bar dataKey="walletShare" fill="#14B8A6" name="walletShare" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="growth" fill="#3B82F6" name="growth" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="6-Month Wallet Trends" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={walletTrends} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} height={40} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ maxWidth: '200px', fontSize: '12px' }} />
                  <Bar dataKey="walletShare" fill="#14B8A6" name="Wallet Share %" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="growth" stroke="#8B5CF6" strokeWidth={3} name="Growth Rate %" dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {hasPermission('canAccessHR') && (
          <>
            <ChartCard title="Sales Team Wallet Performance" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ team: 'Team A', walletGrowth: 9.2, customerSat: 4.7 },{ team: 'Team B', walletGrowth: 8.1, customerSat: 4.5 },{ team: 'Team C', walletGrowth: 10.3, customerSat: 4.8 },{ team: 'Team D', walletGrowth: 7.4, customerSat: 4.3 }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="walletGrowth" fill="#14B8A6" name="Wallet Growth %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="customerSat" fill="#8B5CF6" name="Customer Satisfaction" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Team Training Impact" height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ month: 'Jan', beforeTraining: 7.2, afterTraining: 8.1 },{ month: 'Feb', beforeTraining: 7.4, afterTraining: 8.3 },{ month: 'Mar', beforeTraining: 7.1, afterTraining: 8.7 },{ month: 'Apr', beforeTraining: 7.6, afterTraining: 9.1 },{ month: 'May', beforeTraining: 7.8, afterTraining: 9.4 },{ month: 'Jun', beforeTraining: 7.5, afterTraining: 9.2 }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="beforeTraining" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" name="Before Training" dot={{ fill: '#6B7280', strokeWidth: 2, r: 3 }} />
                  <Line type="monotone" dataKey="afterTraining" stroke="#10B981" strokeWidth={3} name="After Training" dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasPermission('canAccessExecutive') && (
          <ChartCard title="Competitive Account Share Analysis" height={350}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="competitor" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number, name: string) => [ `${value}%`, name === 'walletShare' ? 'Wallet Share' : 'Market Share' ]} />
                <Bar dataKey="walletShare" fill="#14B8A6" name="walletShare" radius={[4, 4, 0, 0]} />
                <Bar dataKey="marketShare" fill="#3B82F6" name="marketShare" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
          <ChartCard title="Customer Segment Analysis" height={350}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegments} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="segment" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number, name: string) => [ name === 'walletSize' ? `$${value}` : `${value}%`, name === 'walletSize' ? 'Avg Wallet Size' : name === 'penetration' ? 'Penetration' : 'Growth Rate' ]} />
                <Bar dataKey="penetration" fill="#8B5CF6" name="penetration" radius={[4, 4, 0, 0]} />
                <Bar dataKey="growth" fill="#10B981" name="growth" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(hasPermission('canAccessExecutive') || hasPermission('canAccessRegional')) && (
          <ChartCard title="Regional Account Performance" height={350}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalWallet} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="region" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number, name: string) => [ `${value}%`, name === 'walletShare' ? 'Wallet Share' : 'Growth Rate' ]} />
                <Bar dataKey="walletShare" fill="#14B8A6" name="walletShare" radius={[4, 4, 0, 0]} />
                <Bar dataKey="growth" fill="#3B82F6" name="growth" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {hasPermission('canAccessExecutive') && (
          <ChartCard title="Customer Loyalty Distribution" height={350}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={loyaltyMetrics} cx="50%" cy="50%" outerRadius={100} innerRadius={40} paddingAngle={2} dataKey="percentage">
                  {loyaltyMetrics.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {loyaltyMetrics.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.metric}: {item.percentage}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasPermission('canAccessExecutive') && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Account Growth Opportunities
            </h3>
            <div className="space-y-3">
              {walletOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{opportunity.opportunity}</h4>
                      <p className="text-sm text-gray-600">Potential: +{opportunity.potential}% | {opportunity.timeline}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(opportunity.difficulty)}`}>{opportunity.difficulty}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Account Insights & Actions
          </h3>
          <div className="space-y-4">
            {hasPermission('canAccessExecutive') && (
              <>
                <div className="border-l-4 border-green-400 bg-green-50 p-4">
                  <h4 className="text-sm font-medium text-green-800">Top Performer</h4>
                  <p className="text-sm text-green-700 mt-1">A region leading wallet share - expand successful strategies</p>
                </div>
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                  <h4 className="text-sm font-medium text-blue-800">Growth Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">Premium segment showing growth - focus on high-value customers</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center"><div className="text-2xl font-bold text-blue-600">{totalWalletShare.toFixed(1)}%</div><div className="text-sm text-gray-600">Total Wallet Share</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-indigo-600">{walletGrowth ? walletGrowth.toFixed(1) : '—'}%</div><div className="text-sm text-gray-600">Wallet Growth</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-green-600">{avgWalletSize ? `$${avgWalletSize.toFixed(2)}` : '—'}</div><div className="text-sm text-gray-600">Avg Wallet Size</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-purple-600">{customerPenetration ? customerPenetration.toFixed(1) : '—'}%</div><div className="text-sm text-gray-600">Customer Penetration</div></div>
        </div>
      </div>
    </div>
  );
};

export default RetailWalletPage;