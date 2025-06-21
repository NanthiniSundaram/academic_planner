import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setViewMode, setSelectedDate, deleteItem } from '../../store/slices/scheduleSlice';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Edit2, Trash2 } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import ScheduleForm from './ScheduleForm';


const CalendarView = () => {
  const dispatch = useAppDispatch();
  const { items, selectedDate, viewMode } = useAppSelector((state) => state.schedule);
  const { courses } = useAppSelector((state) => state.courses);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date.toISOString().split('T')[0]));
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getItemsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return items.filter(item => item.date === dateStr);
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate.startsWith(dateStr));
  };

  const weekDays = getWeekDays();
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
          <p className="text-gray-500 mt-1">
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => dispatch(setViewMode(mode))}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Week View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 text-center text-sm font-medium text-gray-500">
            Time
          </div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-4 text-center cursor-pointer transition-colors ${
                isSameDay(day, new Date(selectedDate))
                  ? 'bg-blue-50 border-b-2 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleDateSelect(day)}
            >
              <div className="text-sm font-medium text-gray-900">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold mt-1 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 max-h-96 overflow-y-auto">
          {/* Time Column */}
          <div className="border-r border-gray-200">
            {timeSlots.slice(8, 20).map((hour) => (
              <div key={hour} className="h-16 border-b border-gray-100 p-2 text-xs text-gray-500">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day) => {
            const dayItems = getItemsForDate(day);
            const dayTasks = getTasksForDate(day);

            return (
              <div key={day.toISOString()} className="border-r border-gray-200 relative">
                {timeSlots.slice(8, 20).map((hour) => (
                  <div key={hour} className="h-16 border-b border-gray-100 p-1 relative">
                    {dayItems.map((item) => {
                      const startHour = parseInt(item.startTime.split(':')[0]);
                      const endHour = parseInt(item.endTime.split(':')[0]);
                      const duration = endHour - startHour;
                      
                      if (startHour === hour) {
                        return (
                          <div
                            key={item.id}
                            className="absolute left-1 right-1 rounded text-xs text-white p-1 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: item.color,
                              height: `${duration * 64 - 4}px`,
                              zIndex: 10,
                            }}
                            onClick={() => setEditingItem(item)}
                          >
                            <div className="font-medium truncate">{item.title}</div>
                            <div className="opacity-75 truncate">
                              {item.startTime} - {item.endTime}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Tasks */}
                    {dayTasks.map((task) => {
                      const taskHour = parseInt(task.dueDate.split('T')[1]?.split(':')[0] || '0');
                      if (taskHour === hour) {
                        return (
                          <div
                            key={task.id}
                            className="absolute left-1 right-1 bottom-0 bg-orange-500 text-white text-xs p-1 rounded"
                            style={{ zIndex: 5 }}
                          >
                            <div className="font-medium truncate">{task.title}</div>
                            <div className="opacity-75 truncate">Due: {format(new Date(task.dueDate), 'h:mm a')}</div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Events Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Events for {format(new Date(selectedDate), 'EEEE, MMMM d')}
        </h3>
        
        <div className="space-y-3">
          {getItemsForDate(new Date(selectedDate)).map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500">
                  {item.startTime} - {item.endTime}
                  {item.location && ` • ${item.location}`}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {item.type}
                </span>
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => dispatch(deleteItem(item.id))}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {getTasksForDate(new Date(selectedDate)).map((task) => {
            return (
              <div key={task.id} className="flex items-center space-x-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-orange-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-500">
                    Due: {format(new Date(task.dueDate), 'h:mm a')} • {courses.find(c => c.id === task.courseId)?.code}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            );
          })}
          
          {getItemsForDate(new Date(selectedDate)).length === 0 && getTasksForDate(new Date(selectedDate)).length === 0 && (
            <p className="text-gray-500 text-center py-8">No events or tasks for this day</p>
          )}
        </div>
      </div>

      {/* Schedule Form Modal */}
      <ScheduleForm
        isOpen={showAddForm || !!editingItem}
        onClose={() => {
          setShowAddForm(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarView;