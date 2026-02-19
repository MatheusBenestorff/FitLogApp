import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ClipboardList, 
  Dumbbell, 
  User, 
  Settings, 
  Search, 
  LogOut 
} from "lucide-react";

import logoImg from "../assets/logo.png"; 
import avatarImg from "../assets/avatar-placeholder.png"; 

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1
        ${isActive 
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
        }
      `}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 left-0">
      
      {/* Header da Sidebar (Logo + Busca) */}
      <div className="p-6 pb-2">
        <img src={logoImg} alt="FitLog" className="h-8 mb-6 object-contain" />
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users" 
            className="w-full bg-gray-100 text-sm text-gray-700 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <NavItem to="/dashboard" icon={Home} label="Feed" />
        <NavItem to="/workouts" icon={ClipboardList} label="Workouts" />
        <NavItem to="/exercises" icon={Dumbbell} label="Exercises" />
        <NavItem to="/profile" icon={User} label="Profile" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* Rodapé da Sidebar (Usuário) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
          <img 
            src={avatarImg} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Matheus Benestorff</p>
            <p className="text-xs text-gray-500 truncate">Free Account</p>
          </div>
          <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
        </div>
      </div>

    </aside>
  );
};