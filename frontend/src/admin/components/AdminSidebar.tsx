import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Boxes,
  Users,
  Truck,
  TicketPercent,
  Star,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', path: '/admin/products', icon: Layers },
  { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
  { label: 'Customers & VIP', path: '/admin/customers', icon: Users },
  { label: 'Fulfillment & POD', path: '/admin/fulfillment', icon: Truck },
  { label: 'Discounts & Promos', path: '/admin/discounts', icon: TicketPercent },
  { label: 'Reviews & UGC', path: '/admin/reviews', icon: Star },
  { label: 'Storefront CMS', path: '/admin/content', icon: FileText },
  { label: 'Store Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const { user, role, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-[#100F0E] border-r border-[#242321] flex flex-col justify-between h-screen sticky top-0 z-40 select-none font-montserrat">
      {/* Brand Header matching website navbar */}
      <div>
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#242321]">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="font-bold text-base tracking-[0.2em] text-[#F4F0E8]">
              VYOMIK
            </span>
            <span className="text-[9px] px-1.5 py-0.5 bg-[#C85A2E]/20 text-[#C85A2E] border border-[#C85A2E]/30 rounded-md font-semibold tracking-wider">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1C1A18] text-[#F4F0E8] border border-[#38342E]'
                      : 'text-[#A8A29E] hover:text-[#F4F0E8] hover:bg-[#151413] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#C85A2E]' : 'text-[#716B63]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#C85A2E] text-white rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-[#242321]">
        <div className="bg-[#141414] border border-[#242321] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0B0B0B] border border-[#242321] flex items-center justify-center text-xs text-[#F4F0E8] font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#F4F0E8] truncate">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-[#C85A2E] uppercase font-bold tracking-wider">
                {role.replace('_', ' ')}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out of Admin Console"
            className="p-1.5 text-[#716B63] hover:text-[#F4F0E8] hover:bg-[#1E1B18] rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
