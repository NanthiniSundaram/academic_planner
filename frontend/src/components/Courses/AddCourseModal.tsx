import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addCourse } from '../../store/slices/coursesSlice';
import { Course } from '../../store/slices/coursesSlice';

const AddCourseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [credits, setCredits] = useState(3);
    const [instructor, setInstructor] = useState('');
    const [color, setColor] = useState('#3B82F6');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCourse: Partial<Course> = {
            id: new Date().toISOString(),
            name,
            code,
            credits,
            instructor,
            color,
            schedule: [],
        };
        dispatch(addCourse(newCourse as Course));
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Course Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Course Code</label>
                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Credits</label>
                            <input type="number" value={credits} onChange={(e) => setCredits(parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Instructor</label>
                        <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Color</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Course</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal; 