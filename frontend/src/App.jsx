import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './Components/store';
import Sidebar from './Components/Layout/Sidebar';
import Header from './Components/Layout/Header';
import DashboardView from './Components/Dashboard/DashboardView';
import CalendarView from './Components/Calendar/CalendarView';
import CoursesView from './Components/Courses/CoursesView';
import TasksView from './Components/Tasks/TasksView';
import ProgressView from './Components/Progress/ProgressView';
import ProfileView from './Components/Profile/ProfileView';

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
      case 'progress':
        return <ProgressView />;
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