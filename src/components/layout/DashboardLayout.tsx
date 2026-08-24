import React from 'react';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: Array<{
    label: string;
    icon: React.ReactNode;
    path: string;
  }>;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems,
  title,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const currentUser = userService.getCurrentUser();

  const handleLogout = () => {
    userService.logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${
        isMobileMenuOpen ? 'fixed' : 'hidden'
      } md:relative md:flex flex-col w-full md:w-64 bg-gray-900 text-white z-50 transition-all duration-300`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} />
            <span className="font-bold">Dashboard</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-300 mb-4">
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-gray-500 text-xs">{currentUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
