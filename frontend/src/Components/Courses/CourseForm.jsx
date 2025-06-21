import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addCourse, updateCourse } from '../../store/slices/coursesSlice';
import { X, Plus, Trash2 } from 'lucide-react';


const CourseForm = ({ isOpen, onClose, editingCourse }) => {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    color: '#3B82F6',
    instructor: '',
    description: '',
    schedule: [] ,
  });

  const [newScheduleItem, setNewScheduleItem] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    location: '',
  });

  const colorOptions = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name,
        code: editingCourse.code,
        credits: editingCourse.credits,
        color: editingCourse.color,
        instructor: editingCourse.instructor,
        description: editingCourse.description || '',
        schedule: editingCourse.schedule,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        credits: 3,
        color: '#3B82F6',
        instructor: '',
        description: '',
        schedule: [],
      });
    }
  }, [editingCourse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const courseData = {
      id: editingCourse?.id || Date.now().toString(),
      ...formData,
    };

    if (editingCourse) {
      dispatch(updateCourse(courseData));
    } else {
      dispatch(addCourse(courseData));
    }
    
    onClose();
  };

  const handleAddScheduleItem = () => {
    if (newScheduleItem.location.trim()) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, { ...newScheduleItem }]
      }));
      setNewScheduleItem({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        location: '',
      });
    }
  };

  const handleRemoveScheduleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Advanced Machine Learning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CS 6340"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dr. Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter course description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Schedule</label>
            
            {/* Add new schedule item */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={newScheduleItem.day}
                  onChange={(e) => setNewScheduleItem(prev => ({ ...prev, day: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                
                <input
                  type="time"
                  value={newScheduleItem.startTime}
                  onChange={(e) => setNewScheduleItem(prev => ({ ...prev, startTime: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <input
                  type="time"
                  value={newScheduleItem.endTime}
                  onChange={(e) => setNewScheduleItem(prev => ({ ...prev, endTime: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newScheduleItem.location}
                    onChange={(e) => setNewScheduleItem(prev => ({ ...prev, location: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Location"
                  />
                  <button
                    type="button"
                    onClick={handleAddScheduleItem}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Existing schedule items */}
            <div className="space-y-2">
              {formData.schedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <span className="text-sm font-medium text-gray-700">{item.day}</span>
                    <span className="text-sm text-gray-600">{item.startTime}</span>
                    <span className="text-sm text-gray-600">{item.endTime}</span>
                    <span className="text-sm text-gray-600">{item.location}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveScheduleItem(index)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingCourse ? 'Update Course' : 'Add Course'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm; 