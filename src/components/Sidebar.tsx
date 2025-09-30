import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import {
  Home,
  FileText,
  Target,
  Package,
  DollarSign,
  Truck,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/context/RoleContext'; // ✅ Import UserRole type

const Sidebar: React.FC = () => {
  const { user, setUser } = useRole();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Summary', href: '/summary', icon: FileText },
    { name: 'Feature Execution', href: '/feature-execution', icon: Target },
    { name: 'OSA', href: '/osa', icon: Package },
    { name: 'Account performance', href: '/retail-wallet', icon: DollarSign },
    { name: 'Supply Chain', href: '/supply-chain', icon: Truck },
  ];

  // List of roles for demo switching (except HR)
  const roles: { key: UserRole; label: string }[] = [
    { key: 'executive', label: 'Executive' },
    { key: 'regional', label: 'Regional' },
    { key: 'store_manager', label: 'Store Manager' },
    { key: 'area_manager', label: 'Area Manager' },
    { key: 'category_manager', label: 'Category Manager' },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-200 p-2 rounded-lg shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar container */}
      <div
        className={cn(
          'fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0' // Always visible on medium+ screens
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">CPG Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">
            {user.role.replace('_', ' ')}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={() => setIsOpen(false)} // close sidebar on mobile nav click
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Role Switcher (for demo purposes) */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Demo: Switch Role</p>
          <div className="space-y-1">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => {
                  import('@/context/RoleContext').then((mod) => {
                    setUser(mod.getMockUser(role.key)); // ✅ role.key is now type-safe
                  });
                }}
                className={cn(
                  'w-full text-left px-3 py-1 text-xs rounded capitalize transition-colors',
                  user.role === role.key
                    ? 'bg-teal-100 text-teal-800'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
