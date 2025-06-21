import React from 'react';
import { useSelector } from 'react-redux';
import { Clock, BookOpen, CheckSquare, TrendingUp, Brain, Calendar } from 'lucide-react';
import { RootState } from '../../store';

const DashboardView: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Mock data for demonstration
  const stats = [
    {
      title: 'Productivity Score',
      value: '85%',
      icon: TrendingUp,
      color: 'from-green-400 to-blue-500',
      change: '+5% from last week',
    },
    {
      title: 'Weekly Study Hours',
      value: '32h',
      icon: Clock,
      color: 'from-blue-400 to-purple-500',
      change: '+2h from last week',
    },
    {
      title: 'Active Courses',
      value: '5',
      icon: BookOpen,
      color: 'from-purple-400 to-pink-500',
      change: 'All courses on track',
    },
    {
      title: 'Completion Rate',
      value: '78%',
      icon: CheckSquare,
      color: 'from-green-400 to-teal-500',
      change: '23/30 tasks',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Research Paper Draft',
      course: 'CS 101',
      dueDate: 'Tomorrow, 2:00 PM',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Math Assignment #5',
      course: 'MATH 201',
      dueDate: 'Friday, 11:59 PM',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Lab Report',
      course: 'PHYS 101',
      dueDate: 'Monday, 9:00 AM',
      priority: 'low',
    },
  ];

  const todaySchedule = [
    {
      id: 1,
      title: 'Computer Science Lecture',
      time: '9:00 AM - 10:30 AM',
      type: 'Lecture',
    },
    {
      id: 2,
      title: 'Study Session',
      time: '2:00 PM - 4:00 PM',
      type: 'Study',
    },
    {
      id: 3,
      title: 'Math Tutorial',
      time: '6:00 PM - 7:30 PM',
      type: 'Tutorial',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-indigo-100">{currentDate}</p>
        <p className="text-indigo-100 mt-2">
          {user?.major} • Year {user?.year} • Student ID: {user?.studentId}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 mb-2">{stat.title}</div>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <span className="text-sm text-gray-500">{upcomingTasks.length} tasks</span>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${
                    task.priority === 'high' ? 'border-red-200 bg-red-50' : 
                    task.priority === 'medium' ? 'border-orange-200 bg-orange-50' :
                    'border-gray-200 bg-gray-50'
                  } hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{task.course}</span>
                    </span>
                    <span className="font-medium">Due {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            </div>
            
            <div className="space-y-3">
              {todaySchedule.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                    <div className="text-xs text-blue-600">{item.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-3 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors">
                <div className="font-medium text-purple-900 text-sm mb-1">Add New Task</div>
                <div className="text-xs text-purple-700">Create a new assignment or task</div>
              </button>
              
              <button className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors">
                <div className="font-medium text-blue-900 text-sm mb-1">Schedule Study Time</div>
                <div className="text-xs text-blue-700">Block time for focused studying</div>
              </button>
              
              <button className="w-full p-3 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors">
                <div className="font-medium text-green-900 text-sm mb-1">View Progress</div>
                <div className="text-xs text-green-700">Check your academic progress</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;