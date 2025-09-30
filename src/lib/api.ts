export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export const Api = {
  getKpis: () => fetchJson<{ featureExecution: number; featureExpectedLocation: number; dayOneReady: number; incrementalGainLoss: number }>(
    '/api/kpis'
  ),
  getFeatureExecutionByCategory: () => fetchJson<Array<{ category: string; value: number; color?: string }>>(
    '/api/feature-execution-by-category'
  ),
  getDayOneReady: () => fetchJson<Array<{ category: string; value: number; color?: string }>>('/api/day-one-ready'),
  getIncrementalImpact: () => fetchJson<Array<{ category: string; value: number }>>('/api/incremental-impact'),
  getHierarchyPerformance: () => fetchJson<Array<{ store: string; performance: number }>>('/api/hierarchy-performance'),
  // OSA
  getOsaKpis: () => fetchJson<{ overallOSA: number | null; outOfStockRate: number | null; replenishmentSpeed: number | null; inventoryTurnover: number | null }>('/api/osa/kpis'),
  getOsaByCategory: () => fetchJson<Array<{ category: string; osa: number; outOfStock: number; replenishment: number | null }>>('/api/osa/by-category'),
  getOsaRegional: () => fetchJson<Array<{ region: string; osa: number; stores: number; criticalOOS: number }>>('/api/osa/regional'),
  // Supply Chain
  getSupplyKpis: () => fetchJson<{ onTimeDelivery: number | null; inventoryAccuracy: number | null; orderFulfillment: number | null; supplierPerformance: number | null }>('/api/supply/kpis'),
  getSupplyDeliveryByCategory: () => fetchJson<Array<{ category: string; onTime: number; accuracy: number }>>('/api/supply/delivery-by-category'),
  getSupplyTrends: () => fetchJson<Array<{ week: string; onTime: number; accuracy: number; issues: number }>>('/api/supply/trends'),
  getSuppliers: () => fetchJson<Array<{ supplier: string; performance: number; reliability: number }>>('/api/supply/suppliers'),
  // Wallet
  getWalletKpis: () => fetchJson<{ totalWalletShare: number | null; walletGrowth: number | null; customerPenetration: number | null; avgWalletSize: number | null }>(
    '/api/wallet/kpis'
  ),
  getWalletByCategory: () => fetchJson<Array<{ category: string; walletShare: number; growth: number; penetration: number }>>('/api/wallet/by-category'),
  getWalletCompetitors: () => fetchJson<Array<{ competitor: string; walletShare: number; marketShare: number }>>('/api/wallet/competitors'),
  getWalletRegions: () => fetchJson<Array<{ region: string; walletShare: number; growth: number; customers: number | null }>>('/api/wallet/regions'),
  // Summary
  getSummaryMonthly: () => fetchJson<Array<{ month: string; execution: number; revenue: number; compliance: number }>>('/api/summary/monthly'),
  getSummaryRegions: () => fetchJson<Array<{ region: string; execution: number; revenue: number; stores: number }>>('/api/summary/regions'),
  getSummaryCategories: () => fetchJson<Array<{ name: string; value: number; color: string }>>('/api/summary/categories'),
  getSummaryTopIssues: () => fetchJson<Array<{ issue: string; count: number; severity: string }>>('/api/summary/top-issues'),
};


