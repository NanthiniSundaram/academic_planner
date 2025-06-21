import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addStudySession,updateGoals } from '../store/slices/progressSlice';

import { 
  Clock, 
  TrendingUp, 
  Plus, 
  Edit2, 
  Flame,
  CheckCircle
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const ProgressView = () => {
  const dispatch = useAppDispatch();
  const { studySessions, metrics, goals } = useAppSelector((state) => state.progress);
  const { courses } = useAppSelector((state) => state.courses);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [showAddSession, setShowAddSession] = useState(false);
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [newSession, setNewSession] = useState({
    duration: 60,
    courseId: '',
    notes: '',
    productivity: 7,
  });
  const [editedGoals, setEditedGoals] = useState(goals);

  const handleAddSession = () => {
    if (newSession.courseId) {
      dispatch(addStudySession({
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...newSession,
      }));
      setNewSession({ duration: 60, courseId: '', notes: '', productivity: 7 });
      setShowAddSession(false);
    }
  };

  const handleSaveGoals = () => {
    dispatch(updateGoals(editedGoals));
    setShowEditGoals(false);
  };

  const getWeeklyData = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const sessions = studySessions.filter(session => session.date === dayStr);
      const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
      return {
        day: format(day, 'EEE'),
        hours: totalMinutes / 60,
        sessions: sessions.length,
      };
    });
  };

  const weeklyData = getWeeklyData();
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Tracker</h2>
          <p className="text-gray-500 mt-1">Monitor your study progress and academic performance</p>
        </div>
        
        <button
          onClick={() => setShowAddSession(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Session</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.totalStudyHours.toFixed(1)}h</div>
          <div className="text-sm text-gray-500 mb-2">Total Study Hours</div>
          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
            {metrics.weeklyStudyHours.toFixed(1)}h this week
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.averageProductivity.toFixed(1)}/10</div>
          <div className="text-sm text-gray-500 mb-2">Avg Productivity</div>
          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
            Great focus!
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.taskCompletionRate}%</div>
          <div className="text-sm text-gray-500 mb-2">Task Completion</div>
          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
            {completedTasks}/{totalTasks} tasks
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{metrics.streakDays}</div>
          <div className="text-sm text-gray-500 mb-2">Study Streak</div>
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block">
            Keep it up!
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Study Hours</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Study Hours</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="h-8 bg-blue-500 rounded transition-all duration-300"
                        style={{ 
                          width: `${Math.min((day.hours / goals.dailyStudyHours) * 100, 100)}%`,
                          opacity: day.hours > 0 ? 1 : 0.3
                        }}
                      ></div>
                      <span className="text-sm text-gray-600 min-w-[3rem]">
                        {day.hours.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-16 text-right">
                    {day.sessions} sessions
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Weekly Goal:</span>
                <span className="font-medium text-gray-900">{goals.weeklyStudyHours}h</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((metrics.weeklyStudyHours / goals.weeklyStudyHours) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals & Recent Sessions */}
        <div className="space-y-6">
          {/* Study Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Study Goals</h3>
              <button
                onClick={() => setShowEditGoals(true)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Daily</span>
                  <span className="font-medium text-gray-900">{goals.dailyStudyHours}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${Math.min((metrics.weeklyStudyHours / 7 / goals.dailyStudyHours) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Weekly</span>
                  <span className="font-medium text-gray-900">{goals.weeklyStudyHours}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((metrics.weeklyStudyHours / goals.weeklyStudyHours) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Monthly</span>
                  <span className="font-medium text-gray-900">{goals.monthlyStudyHours}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{ width: `${Math.min((metrics.totalStudyHours / goals.monthlyStudyHours) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Study Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
            
            <div className="space-y-3">
              {studySessions.slice(0, 5).map((session) => {
                const course = courses.find(c => c.id === session.courseId);
                return (
                  <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course?.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{course?.code}</span>
                      </div>
                      <span className="text-xs text-gray-500">{session.duration}min</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {format(new Date(session.date), 'MMM dd, yyyy')}
                    </div>
                    {session.notes && (
                      <div className="text-xs text-gray-500 truncate">{session.notes}</div>
                    )}
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-gray-500">Productivity:</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < session.productivity ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Study Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Study Session</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={newSession.courseId}
                  onChange={(e) => setNewSession(prev => ({ ...prev, courseId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Productivity (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newSession.productivity}
                  onChange={(e) => setNewSession(prev => ({ ...prev, productivity: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>{newSession.productivity}/10</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleAddSession}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Session
              </button>
              <button
                onClick={() => setShowAddSession(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goals Modal */}
      {showEditGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Study Goals</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={editedGoals.dailyStudyHours}
                  onChange={(e) => setEditedGoals(prev => ({ ...prev, dailyStudyHours: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={editedGoals.weeklyStudyHours}
                  onChange={(e) => setEditedGoals(prev => ({ ...prev, weeklyStudyHours: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={editedGoals.monthlyStudyHours}
                  onChange={(e) => setEditedGoals(prev => ({ ...prev, monthlyStudyHours: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleSaveGoals}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Goals
              </button>
              <button
                onClick={() => setShowEditGoals(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressView; 