import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available roles
export type UserRole = 'executive' | 'regional' | 'store_manager' | 'area_manager' | 'category_manager' | 'hr' | 'admin';

// Define role permissions
export interface RolePermissions {
  canAccessExecutive: boolean;
  canAccessRegional: boolean;
  canAccessStore: boolean;
  canAccessArea: boolean;
  canAccessCategory: boolean;
  canAccessHR: boolean;
  region?: string;
  area?: string;
  store?: string;
  category?: string;
}

interface User {
  id: string;
  name: string;
  role: UserRole;
  permissions: RolePermissions;
}

interface RoleContextType {
  user: User | null;
  setUser: (user: User) => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  executive: {
    id: '1',
    name: 'John Executive',
    role: 'executive',
    permissions: {
      canAccessExecutive: true,
      canAccessRegional: true,
      canAccessStore: true,
      canAccessArea: true,
      canAccessCategory: true,
      canAccessHR: true,
    },
  },
  regional: {
    id: '2',
    name: 'Jane Regional',
    role: 'regional',
    permissions: {
      canAccessExecutive: false,
      canAccessRegional: true,
      canAccessStore: true,
      canAccessArea: true,
      canAccessCategory: true,
      canAccessHR: false,
      region: 'KUSA',
    },
  },
  store_manager: {
    id: '3',
    name: 'Sam Store',
    role: 'store_manager',
    permissions: {
      canAccessExecutive: false,
      canAccessRegional: false,
      canAccessStore: true,
      canAccessArea: false,
      canAccessCategory: false,
      canAccessHR: false,
      store: 'Store 1',
    },
  },
  area_manager: {
    id: '4',
    name: 'Alex Area',
    role: 'area_manager',
    permissions: {
      canAccessExecutive: false,
      canAccessRegional: true,
      canAccessStore: true,
      canAccessArea: true,
      canAccessCategory: false,
      canAccessHR: false,
      area: 'KUSA Area',
    },
  },
  category_manager: {
    id: '5',
    name: 'Cathy Category',
    role: 'category_manager',
    permissions: {
      canAccessExecutive: false,
      canAccessRegional: false,
      canAccessStore: false,
      canAccessArea: false,
      canAccessCategory: true,
      canAccessHR: false,
      category: 'SEASONAL',
    },
  },
  hr: {
    id: '6',
    name: 'HR Manager',
    role: 'hr',
    permissions: {
      canAccessExecutive: false,
      canAccessRegional: false,
      canAccessStore: false,
      canAccessArea: false,
      canAccessCategory: false,
      canAccessHR: true,
    },
  },
  admin: {
    id: '7',
    name: 'System Admin',
    role: 'admin',
    permissions: {
      canAccessExecutive: true,
      canAccessRegional: true,
      canAccessStore: true,
      canAccessArea: true,
      canAccessCategory: true,
      canAccessHR: true,
    },
  },
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  // Default to executive role for demo purposes
  const [user, setUser] = useState<User | null>(mockUsers.executive);

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!user) return false;
    return !!user.permissions[permission];
  };

  return (
    <RoleContext.Provider value={{ user, setUser, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Helper function to get mock user by role
export const getMockUser = (role: UserRole): User => mockUsers[role];