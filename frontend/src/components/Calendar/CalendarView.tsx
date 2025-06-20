import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setViewMode, setSelectedDate, setEventModalOpen, deleteScheduleItem, getSchedule } from '../../store/slices/scheduleSlice';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';
import { ScheduleItem } from '../../store/slices/scheduleSlice';

const CalendarView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, selectedDate, viewMode, isEventModalOpen } = useAppSelector((state) => state.schedule);
  const { courses } = useAppSelector((state) => state.courses);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    dispatch(getSchedule());
  }, [dispatch]);

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleDateSelect = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString().split('T')[0]));
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteScheduleItem(itemId));
    }
  };

  const handleEdit = (item: ScheduleItem) => {
    setSelectedEvent(item);
    setIsEditModalOpen(true);
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return items.filter(item => item.date.startsWith(dateStr));
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate.startsWith(dateStr));
  };

  const weekDays = getWeekDays();
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="p-6 space-y-6" key={viewMode}>
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
                onClick={() => dispatch(setViewMode(mode as 'day' | 'week' | 'month'))}
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
            onClick={() => dispatch(setEventModalOpen(true))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
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
                            className="absolute left-1 right-1 rounded text-xs text-white p-1 overflow-hidden"
                            style={{
                              backgroundColor: item.color,
                              height: `${duration * 64 - 4}px`,
                              zIndex: 10,
                            }}
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
                        const course = courses.find(c => c.id === task.courseId);
                        return (
                          <div
                            key={task.id}
                            className="absolute left-1 right-1 bottom-0 bg-orange-500 text-white text-xs p-1 rounded"
                            style={{ zIndex: 5 }}
                          >
                            <div className="font-medium truncate">{task.title}</div>
                            <div className="text-sm text-gray-500">
                              Due: {format(new Date(task.dueDate), 'h:mm a')} • {course?.code}
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-1 hover:bg-orange-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                              </button>
                              <button className="p-1 hover:bg-orange-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              </button>
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
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="p-1 hover:bg-gray-200 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-gray-200 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {item.type}
              </span>
            </div>
          ))}
          
          {getTasksForDate(new Date(selectedDate)).map((task) => {
            const course = courses.find(c => c.id === task.courseId);
            return (
              <div key={task.id} className="flex items-center space-x-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-orange-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-500">
                    Due: {format(new Date(task.dueDate), 'h:mm a')} • {course?.code}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-orange-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button className="p-1 hover:bg-orange-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
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
      <AddEventModal isOpen={isEventModalOpen} onClose={() => dispatch(setEventModalOpen(false))} />
      <EditEventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} event={selectedEvent} />
    </div>
  );
};

export default CalendarView;