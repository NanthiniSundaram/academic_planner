import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScheduleItem {
  id: string;
  title: string;
  type: 'class' | 'study' | 'break' | 'exam' | 'meeting';
  startTime: string;
  endTime: string;
  date: string;
  courseId?: string;
  taskId?: string;
  location?: string;
  description?: string;
  color: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
}

interface ScheduleState {
  items: ScheduleItem[];
  selectedDate: string;
  viewMode: 'day' | 'week' | 'month';
  loading: boolean;
}

const initialState: ScheduleState = {
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
    setItems: (state, action: PayloadAction<ScheduleItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<ScheduleItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<ScheduleItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'day' | 'week' | 'month'>) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setItems, addItem, updateItem, deleteItem, setSelectedDate, setViewMode, setLoading } = scheduleSlice.actions;
export default scheduleSlice.reducer;