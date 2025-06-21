import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardView from './components/Dashboard/DashboardView';
import CalendarView from './components/Calendar/CalendarView';
import CoursesView from './components/Courses/CoursesView';
import TasksView from './components/Tasks/TasksView';
import AIInsightsView from './components/AI/AIInsightsView';
import ProfileView from './components/Profile/ProfileView';

function App() {
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
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </Provider>
  );
}

export default App;