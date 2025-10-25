import React from 'react';
import { LogOut, Menu, User, Settings, BarChart3, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = ({ onMenuToggle, onSettingsClick, hasOverview, activeView, onOverviewClick, onChatClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
       <button onClick={onMenuToggle} className="p-2 hover:bg-gray-100 rounded-lg">
  <Menu className="w-5 h-5" />
</button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <BarChart3 className="w-6 h-6 text-teal-600" />
          </div>
          <span className="font-semibold text-lg text-gray-900">
            InsightAI
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
{hasOverview && activeView==="chat" &&(
  <button
    onClick={() => onOverviewClick()}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
      ${activeView === "overview" ? "bg-teal-50 text-teal-700" : "hover:bg-teal-50 text-teal-700"}
    `}
    title="View Database Overview"
  >
    <Database className="w-4 h-4" />
    <span className="text-sm font-medium hidden sm:inline">Overview</span>
  </button>
)}

{ activeView==="overview" &&(
        <button
  onClick={() => onChatClick()}
  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
    ${activeView === "chat" ? "bg-teal-50 text-teal-700" : "hover:bg-teal-50 text-teal-700"}
  `}
  title="Chat"
>
  <BarChart3 className="w-4 h-4" />
  <span className="text-sm font-medium hidden sm:inline">Chat</span>
</button>

  )}

        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Database Settings"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">{user?.name || user?.email}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
