import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from '../Dashboard/DashboardView';
import CalendarView from '../Calendar/CalendarView';
import CoursesView from '../Courses/CoursesView';
import TasksView from '../Tasks/TasksView';
import AIInsightsView from '../AI/AIInsightsView';
import ProfileView from '../Profile/ProfileView';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'calendar':
        return <CalendarView />;
      case 'courses':
        return <CoursesView />;
      case 'tasks':
        return <TasksView />;
      case 'ai-insights':
        return <AIInsightsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-500 mt-2">Settings page coming soon...</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout; 