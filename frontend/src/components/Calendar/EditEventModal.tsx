import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ScheduleItem, updateScheduleItem } from '../../store/slices/scheduleSlice';

const EditEventModal: React.FC<{ isOpen: boolean; onClose: () => void; event: ScheduleItem | null }> = ({ isOpen, onClose, event }) => {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector((state) => state.courses);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [eventType, setEventType] = useState('course');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (event) {
      setEventType(event.type === 'class' ? 'course' : 'task');
      setTitle(event.title);
      setDate(event.date.split('T')[0]);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setSelectedCourse(event.courseId || '');
      setSelectedTask(event.taskId || '');
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    let eventData: Partial<ScheduleItem> = {
      id: event.id,
      title,
      date,
      startTime,
      endTime,
      type: eventType as ScheduleItem['type'],
    };

    if (eventType === 'course' && selectedCourse) {
      const course = courses.find((c) => c.id === selectedCourse);
      if (course) {
        eventData = { ...eventData, title: title || course.name, color: course.color, courseId: course.id };
      }
    } else if (eventType === 'task' && selectedTask) {
      const task = tasks.find((t) => t.id === selectedTask);
      if (task) {
        eventData = { ...eventData, title: title || task.title, courseId: task.courseId, taskId: task.id };
      }
    }

    dispatch(updateScheduleItem(eventData as ScheduleItem));
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="course">Course</option>
              <option value="task">Task</option>
            </select>
          </div>

          {eventType === 'course' ? (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Task</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select a task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Midterm Review"
              />
            </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
              <div className="flex space-x-2">
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal; 