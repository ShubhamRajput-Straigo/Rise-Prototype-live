import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  region: string;
  area: string;
  store: string;
  category: string;
  event: string;
  month: string;
}

interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  region: 'All',
  area: 'All',
  store: 'All',
  category: 'All',
  event: 'All',
  month: 'All',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

// Mock filter options
export const filterOptions = {
  region: ['All', 'KUSA Region', 'WM Region', 'WM Market'],
  area: ['All', 'KUSA Area', 'WM Area', 'KUSA Territory'],
  store: ['All', 'Store 1', 'Store 2', 'Store 3', 'Store 4', 'Store 5'],
  category: ['All', 'PWS', 'SEASONAL', 'BTEC', 'CRACKERS', 'FROZEN BREAKFAST', 'SALTY', 'NM'],
  event: ['All', 'Event A', 'Event B', 'Event C'],
  month: ['All', 'January', 'February', 'March', 'April', 'May', 'June'],
};