import React from 'react';
import { useFilter, filterOptions } from '@/context/FilterContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const GlobalFilterBar: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useFilter();

  const filterConfigs = [
    { key: 'region' as const, label: 'Region', options: filterOptions.region },
    { key: 'area' as const, label: 'Area', options: filterOptions.area },
    { key: 'store' as const, label: 'Store', options: filterOptions.store },
    { key: 'category' as const, label: 'Category', options: filterOptions.category },
    { key: 'event' as const, label: 'Event', options: filterOptions.event },
    { key: 'month' as const, label: 'Month', options: filterOptions.month },
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h2 className="text-lg font-semibold text-gray-900">Filters Active</h2>
        <Button
          onClick={resetFilters}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mt-2 sm:mt-0"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {filterConfigs.map(({ key, label, options }) => (
          <div key={key} className="min-w-[140px] flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <Select
              value={filters[key]}
              onValueChange={(value) => updateFilter(key, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Active Filter Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Active filters: {Object.entries(filters)
          .filter(([, value]) => value !== 'All')
          .map(([key, value]) => `${key}: ${value}`)
          .join(' | ') || 'None'}
      </div>
    </div>
  );
};

export default GlobalFilterBar;