import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

interface BackendSchedule {
    _id: string;
    date: string;
    timeSlots: TimeSlot[];
}

export interface ScheduleItem {
  id: string;
  _id?: string;
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

interface TimeSlot extends Omit<ScheduleItem, 'id'> {
  _id: string;
}

export const addScheduleItem = createAsyncThunk(
    'schedule/addScheduleItem',
    async (item: Partial<ScheduleItem>, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState() as RootState;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('/api/schedule/item', item, config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const updateScheduleItem = createAsyncThunk(
    'schedule/updateScheduleItem',
    async (item: ScheduleItem, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState() as RootState;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`/api/schedule/item/${item.id}`, item, config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const deleteScheduleItem = createAsyncThunk(
    'schedule/deleteScheduleItem',
    async (itemId: string, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState() as RootState;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`/api/schedule/item/${itemId}`, config);
            return itemId;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const getSchedule = createAsyncThunk(
    'schedule/getSchedule',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState() as RootState;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('/api/schedule', config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

interface ScheduleState {
  items: ScheduleItem[];
  selectedDate: string;
  viewMode: 'day' | 'week' | 'month';
  isEventModalOpen: boolean;
  loading: boolean;
}

const initialState: ScheduleState = {
  items: [
    {
      id: '1',
      _id: '1',
      title: 'Advanced Machine Learning',
      type: 'class',
      startTime: '10:00',
      endTime: '11:30',
      date: '2024-01-15T00:00:00.000Z',
      courseId: '1',
      location: 'Room 301',
      color: '#3B82F6',
      isRecurring: true,
      recurringPattern: 'weekly',
    },
    {
      id: '2',
      _id: '2',
      title: 'Study Session - Neural Networks',
      type: 'study',
      startTime: '14:00',
      endTime: '16:00',
      date: '2024-01-15T00:00:00.000Z',
      courseId: '1',
      taskId: '1',
      location: 'Library',
      color: '#10B981',
      isRecurring: false,
    },
    {
      id: '3',
      _id: '3',
      title: 'Database Systems',
      type: 'class',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-01-16T00:00:00.000Z',
      courseId: '2',
      location: 'Room 205',
      color: '#8B5CF6',
      isRecurring: true,
      recurringPattern: 'weekly',
    },
  ],
  selectedDate: new Date().toISOString().split('T')[0],
  viewMode: 'week',
  isEventModalOpen: false,
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
    setEventModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEventModalOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(getSchedule.pending, (state) => {
            state.loading = true;
        })
        .addCase(getSchedule.fulfilled, (state, action) => {
            state.loading = false;
            const schedules = action.payload as BackendSchedule[];
            const items: ScheduleItem[] = [];
            schedules.forEach((schedule) => {
                schedule.timeSlots.forEach((slot) => {
                    items.push({
                        ...slot,
                        id: slot._id,
                        date: schedule.date,
                    });
                });
            });
            state.items = items;
        })
        .addCase(getSchedule.rejected, (state) => {
            state.loading = false;
        })
        .addCase(addScheduleItem.pending, (state) => {
            state.loading = true;
        })
        .addCase(addScheduleItem.fulfilled, (state, action) => {
            state.loading = false;
            const newSchedule = action.payload;
            const date = newSchedule.date.split('T')[0];
            
            const newItemsForDate = newSchedule.timeSlots.map((slot: TimeSlot) => ({
                ...slot,
                id: slot._id,
                date: newSchedule.date,
            }));

            const otherItems = state.items.filter(item => item.date.split('T')[0] !== date);

            state.items = [...otherItems, ...newItemsForDate];
        })
        .addCase(addScheduleItem.rejected, (state) => {
            state.loading = false;
        })
        .addCase(deleteScheduleItem.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteScheduleItem.fulfilled, (state, action) => {
            state.loading = false;
            state.items = state.items.filter(item => item.id !== action.payload);
        })
        .addCase(deleteScheduleItem.rejected, (state) => {
            state.loading = false;
        })
        .addCase(updateScheduleItem.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateScheduleItem.fulfilled, (state, action) => {
            state.loading = false;
            const updatedSchedule = action.payload;
            const date = updatedSchedule.date.split('T')[0];
            
            const newItemsForDate = updatedSchedule.timeSlots.map((slot: TimeSlot) => ({
                ...slot,
                id: slot._id,
                date: updatedSchedule.date,
            }));

            const otherItems = state.items.filter(item => item.date.split('T')[0] !== date);

            state.items = [...otherItems, ...newItemsForDate];
        })
        .addCase(updateScheduleItem.rejected, (state) => {
            state.loading = false;
        });
  }
});

export const {
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setSelectedDate,
  setViewMode,
  setEventModalOpen,
  setLoading,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;