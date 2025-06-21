import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addTask } from '../../store/slices/tasksSlice';
import { Task } from '../../store/slices/tasksSlice';

const AddTaskModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { courses } = useAppSelector((state) => state.courses);
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [type, setType] = useState<'assignment' | 'exam' | 'project' | 'study' | 'reading'>('assignment');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTask: Partial<Task> = {
            id: new Date().toISOString(),
            title,
            courseId,
            dueDate,
            priority,
            type,
            status: 'pending',
            createdAt: new Date().toISOString(),
            estimatedDuration: 120,
            tags: [],
        };
        dispatch(addTask(newTask as Task));
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Task Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Course</label>
                        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Due Date</label>
                            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value as Task['type'])} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                            <option value="assignment">Assignment</option>
                            <option value="exam">Exam</option>
                            <option value="project">Project</option>
                            <option value="study">Study</option>
                            <option value="reading">Reading</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal; 