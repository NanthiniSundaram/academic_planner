import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: '1',
      title: 'Advanced Machine Learning',
      type: 'class',
      startTime: '10:00',
      endTime: '11:30',
      date: '2024-01-15',
      courseId: '1',
      location: 'Room 301',
      color: '#3B82F6',
      isRecurring: true,
      recurringPattern: 'weekly',
    },
    {
      id: '2',
      title: 'Study Session - Neural Networks',
      type: 'study',
      startTime: '14:00',
      endTime: '16:00',
      date: '2024-01-15',
      courseId: '1',
      taskId: '1',
      location: 'Library',
      color: '#10B981',
      isRecurring: false,
    },
    {
      id: '3',
      title: 'Database Systems',
      type: 'class',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-01-16',
      courseId: '2',
      location: 'Room 205',
      color: '#8B5CF6',
      isRecurring: true,
      recurringPattern: 'weekly',
    },
  ],
  selectedDate: new Date().toISOString().split('T')[0],
  viewMode: 'week',
  loading: false,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setSelectedDate,
  setViewMode,
  setLoading,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
