import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import coursesReducer from './slices/coursesSlice';
import scheduleReducer from './slices/scheduleSlice';
import tasksReducer from './slices/tasksSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: coursesReducer,
    schedule: scheduleReducer,
    tasks: tasksReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;