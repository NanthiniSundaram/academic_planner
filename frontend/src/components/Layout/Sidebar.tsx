import React from 'react';
import { Home, Calendar, BookOpen, CheckSquare, Brain, Settings, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'ai-insights', icon: Brain, label: 'AI Insights' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AcademicAI</h1>
            <p className="text-sm text-gray-500">Smart Planner</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-medium">AI Productivity</span>
          </div>
          <div className="text-2xl font-bold">78%</div>
          <div className="text-xs opacity-90">This week</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;