import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateTask,setFilter } from '../store/slices/tasksSlice';
import { CheckSquare, Clock, Filter, Plus, Calendar, Edit2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import TaskForm from './TaskForm';


const TasksView = () => {
  const dispatch = useAppDispatch();
  const { tasks, filter } = useAppSelector((state) => state.tasks);
  const { courses } = useAppSelector((state) => state.courses);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = tasks.filter(task => {
    if (filter.status !== 'all' && task.status !== filter.status) return false;
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false;
    if (filter.type !== 'all' && task.type !== filter.type) return false;
    if (filter.courseId !== 'all' && task.courseId !== filter.courseId) return false;
    return true;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => t.status === 'overdue' || (isPast(new Date(t.dueDate)) && t.status !== 'completed')).length,
  };

  const handleTaskUpdate = (taskId, updates) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      dispatch(updateTask({ ...task, ...updates }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateStatus = (dueDate) => {
    const due = new Date(dueDate);
    if (isToday(due)) return { text: 'Due today', color: 'text-red-600' };
    if (isTomorrow(due)) return { text: 'Due tomorrow', color: 'text-orange-600' };
    if (isPast(due)) return { text: 'Overdue', color: 'text-red-600' };
    return { text: format(due, 'MMM dd, yyyy'), color: 'text-gray-600' };
  };

  const TaskCard = ({ task }) => {
    const course = courses.find(c => c.id === task.courseId);
    const dueDateStatus = getDueDateStatus(task.dueDate);
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => handleTaskUpdate(task.id, { 
                status: task.status === 'completed' ? 'pending' : 'completed',
                completedAt: task.status === 'completed' ? undefined : new Date().toISOString()
              })}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.status === 'completed' 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.status === 'completed' && <CheckSquare className="w-3 h-3" />}
            </button>
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-1 ${
                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: course?.color }}
                  ></div>
                  <span className="text-gray-600">{course?.code}</span>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {task.type}
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditingTask(task)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className={dueDateStatus.color}>{dueDateStatus.text}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{task.estimatedDuration} min</span>
            </div>
          </div>

          <div className="flex space-x-1">
            {task.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {task.actualDuration && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Time spent:</span>
              <span className="font-medium text-gray-900">{task.actualDuration} min</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-500 mt-1">Manage your assignments, exams, and projects</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
          <div className="text-sm text-blue-600">Total Tasks</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{taskStats.inProgress}</div>
          <div className="text-sm text-purple-600">In Progress</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
          <div className="text-sm text-red-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filter.status}
            onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select
            value={filter.priority}
            onChange={(e) => dispatch(setFilter({ priority: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filter.type}
            onChange={(e) => dispatch(setFilter({ type: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
            <option value="project">Project</option>
            <option value="study">Study</option>
            <option value="reading">Reading</option>
          </select>
          
          <select
            value={filter.courseId}
            onChange={(e) => dispatch(setFilter({ courseId: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {tasks.length === 0 
              ? "Add your first task to get started with your academic planning"
              : "Try adjusting your filters to see more tasks"
            }
          </p>
          {tasks.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Task
            </button>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showAddForm || !!editingTask}
        onClose={() => {
          setShowAddForm(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
      />
    </div>
  );
};

export default TasksView;