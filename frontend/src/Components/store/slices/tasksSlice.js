import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: '1',
      title: 'Neural Network Implementation',
      description: 'Implement a convolutional neural network for image classification',
      type: 'assignment',
      courseId: '1',
      dueDate: '2024-01-15T23:59:00',
      priority: 'high',
      status: 'in-progress',
      estimatedDuration: 480,
      actualDuration: 240,
      tags: ['coding', 'AI', 'tensorflow'],
      createdAt: '2024-01-01T09:00:00',
    },
    {
      id: '2',
      title: 'Database Design Project',
      description: 'Design and implement a relational database for a library management system',
      type: 'project',
      courseId: '2',
      dueDate: '2024-01-20T23:59:00',
      priority: 'medium',
      status: 'pending',
      estimatedDuration: 600,
      tags: ['SQL', 'design', 'normalization'],
      createdAt: '2024-01-02T10:00:00',
    },
    {
      id: '3',
      title: 'Midterm Exam - Software Engineering',
      description: 'Comprehensive exam covering software development lifecycle',
      type: 'exam',
      courseId: '3',
      dueDate: '2024-01-18T14:00:00',
      priority: 'urgent',
      status: 'pending',
      estimatedDuration: 120,
      tags: ['exam', 'theory', 'SDLC'],
      createdAt: '2024-01-01T12:00:00',
    },
  ],
  selectedTask: null,
  filter: {
    status: 'all',
    priority: 'all',
    type: 'all',
    courseId: 'all',
  },
  loading: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  setFilter,
  setLoading,
} = tasksSlice.actions;

export default tasksSlice.reducer;
