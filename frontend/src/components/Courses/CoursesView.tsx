import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addCourse, updateCourse, deleteCourse } from '../../store/slices/coursesSlice';
import { Book, Clock, MapPin, User, Plus, Edit2, Trash2, Users } from 'lucide-react';

const CoursesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector((state) => state.courses);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const getCourseStats = (courseId: string) => {
    const courseTasks = tasks.filter(task => task.courseId === courseId);
    const completedTasks = courseTasks.filter(task => task.status === 'completed').length;
    const totalTasks = courseTasks.length;
    
    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      upcomingTasks: courseTasks.filter(task => task.status !== 'completed').length,
    };
  };

  const CourseCard = ({ course }: { course: any }) => {
    const stats = getCourseStats(course.id);
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: course.color + '20' }}
            >
              <Book className="w-6 h-6" style={{ color: course.color }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.code} • {course.credits} credits</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingCourse(course)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(deleteCourse(course.id))}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <User className="w-4 h-4" />
            <span>{course.instructor}</span>
          </div>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>

        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-gray-900">Schedule</h4>
          {course.schedule.map((session: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">{session.day}</div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{session.startTime} - {session.endTime}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{session.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.totalTasks}</div>
            <div className="text-xs text-gray-500">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
            <div className="text-xs text-gray-500">Progress</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Course Progress</span>
            <span className="text-sm font-medium text-gray-900">{stats.completionRate}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${stats.completionRate}%`,
                backgroundColor: course.color 
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
          <p className="text-gray-500 mt-1">Manage your academic courses and schedules</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Course Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Book className="w-8 h-8" />
            <div className="text-right">
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-sm opacity-90">Active Courses</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <div className="text-right">
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.credits, 0)}</div>
              <div className="text-sm opacity-90">Total Credits</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {courses.reduce((total, course) => total + course.schedule.length, 0)}
              </div>
              <div className="text-sm opacity-90">Weekly Classes</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-8 h-8" />
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(courses.reduce((sum, course) => {
                  const stats = getCourseStats(course.id);
                  return sum + stats.completionRate;
                }, 0) / courses.length) || 0}%
              </div>
              <div className="text-sm opacity-90">Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Add your first course to get started with your academic planning</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesView;