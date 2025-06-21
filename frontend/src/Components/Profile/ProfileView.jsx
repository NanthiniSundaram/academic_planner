import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateProfile } from '../store/slices/userSlice';
import { User, Mail, Target, Clock, Calendar, Edit2, Save, X } from 'lucide-react';

const ProfileView = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { courses } = useAppSelector((state) => state.courses);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    if (editedProfile) {
      dispatch(updateProfile(editedProfile));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  if (!profile) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.name || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{profile.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile?.email || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Study Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Study Time</label>
                {isEditing ? (
                  <select
                    value={editedProfile?.studyPreferences.preferredStudyTime || 'morning'}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      studyPreferences: {
                        ...prev.studyPreferences,
                        preferredStudyTime: e.target.value 
                      }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.studyPreferences.preferredStudyTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Duration (minutes)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile?.studyPreferences.sessionDuration || 60}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      studyPreferences: {
                        ...prev.studyPreferences,
                        sessionDuration: parseInt(e.target.value)
                      }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.studyPreferences.sessionDuration} minutes</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile?.studyPreferences.breakDuration || 15}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      studyPreferences: {
                        ...prev.studyPreferences,
                        breakDuration: parseInt(e.target.value)
                      }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.studyPreferences.breakDuration} minutes</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Study Days Per Week</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={editedProfile?.studyPreferences.studyDaysPerWeek || 5}
                    onChange={(e) => setEditedProfile(prev => prev ? {
                      ...prev,
                      studyPreferences: {
                        ...prev.studyPreferences,
                        studyDaysPerWeek: parseInt(e.target.value)
                      }
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.studyPreferences.studyDaysPerWeek} days</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Goals</h3>
            
            <div className="space-y-3">
              {profile.academicGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Academic Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Active Courses</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{courses.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Total Credits</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{totalCredits}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Completed Tasks</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{completedTasks}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-blue-50 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <div className="font-medium">Download Study Schedule</div>
                <div className="text-sm opacity-75">Export your weekly schedule</div>
              </button>
              
              <button className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors text-left">
                <div className="font-medium">Backup Data</div>
                <div className="text-sm opacity-75">Save your progress</div>
              </button>
              
              <button className="w-full bg-purple-50 text-purple-700 py-3 px-4 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div className="font-medium">Share Progress</div>
                <div className="text-sm opacity-75">Share with advisor</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;