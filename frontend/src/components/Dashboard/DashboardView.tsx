import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Clock, BookOpen, CheckSquare, TrendingUp, AlertCircle, Brain } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';

const DashboardView: React.FC = () => {
  const { tasks } = useAppSelector((state) => state.tasks);
  const { courses } = useAppSelector((state) => state.courses);
  const { items: scheduleItems } = useAppSelector((state) => state.schedule);
  const { insights, recommendations } = useAppSelector((state) => state.ai);

  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const todaySchedule = scheduleItems.filter(item => 
    isToday(new Date(item.date))
  );

  const urgentTasks = tasks.filter(task => 
    task.priority === 'urgent' && task.status !== 'completed'
  ).length;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;

  const stats = [
    {
      title: 'Productivity Score',
      value: `${insights.productivityScore}%`,
      icon: TrendingUp,
      color: 'from-green-400 to-blue-500',
      change: '+5% from last week',
    },
    {
      title: 'Weekly Study Hours',
      value: `${insights.weeklyStudyHours}h`,
      icon: Clock,
      color: 'from-blue-400 to-purple-500',
      change: '+2h from last week',
    },
    {
      title: 'Active Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'from-purple-400 to-pink-500',
      change: 'All courses on track',
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((completedTasks / totalTasks) * 100)}%`,
      icon: CheckSquare,
      color: 'from-green-400 to-teal-500',
      change: `${completedTasks}/${totalTasks} tasks`,
    },
  ];

  return (
    <div className="p-6 space-y-6">
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
              {urgentTasks > 0 && (
                <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{urgentTasks} urgent</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.map((task) => {
                const course = courses.find(c => c.id === task.courseId);
                const dueDate = new Date(task.dueDate);
                const isUrgent = task.priority === 'urgent';
                const isDueSoon = isToday(dueDate) || isTomorrow(dueDate);
                
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border ${
                      isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                    } hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isUrgent ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course?.color }}
                          ></div>
                          <span>{course?.code}</span>
                        </span>
                        <span>{task.type}</span>
                      </div>
                      <span className={isDueSoon ? 'text-red-600 font-medium' : ''}>
                        Due {format(dueDate, 'MMM dd, h:mm a')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Schedule & AI Recommendations */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            
            {todaySchedule.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No scheduled items for today</p>
            ) : (
              <div className="space-y-3">
                {todaySchedule.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">
                        {item.startTime} - {item.endTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              {recommendations.slice(0, 2).map((rec) => (
                <div key={rec.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="font-medium text-purple-900 text-sm mb-1">{rec.title}</div>
                  <div className="text-xs text-purple-700 mb-2">{rec.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600">
                      {rec.confidence}% confidence
                    </span>
                    {rec.action && (
                      <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors">
                        {rec.action}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;