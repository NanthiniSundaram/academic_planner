import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  courseId: string;
  taskId?: string;
  notes?: string;
  productivity: number; // 1-10 scale
}

interface ProgressMetrics {
  totalStudyHours: number;
  weeklyStudyHours: number;
  averageProductivity: number;
  taskCompletionRate: number;
  streakDays: number;
  lastStudyDate: string;
}

interface ProgressState {
  studySessions: StudySession[];
  metrics: ProgressMetrics;
  goals: {
    dailyStudyHours: number;
    weeklyStudyHours: number;
    monthlyStudyHours: number;
  };
  loading: boolean;
}

const initialState: ProgressState = {
  studySessions: [
    {
      id: '1',
      date: '2024-01-15',
      duration: 120,
      courseId: '1',
      taskId: '1',
      notes: 'Worked on neural network implementation',
      productivity: 8,
    },
    {
      id: '2',
      date: '2024-01-14',
      duration: 90,
      courseId: '2',
      notes: 'Database design review',
      productivity: 7,
    },
    {
      id: '3',
      date: '2024-01-13',
      duration: 180,
      courseId: '3',
      taskId: '3',
      notes: 'Software engineering project planning',
      productivity: 9,
    },
  ],
  metrics: {
    totalStudyHours: 6.5,
    weeklyStudyHours: 6.5,
    averageProductivity: 8,
    taskCompletionRate: 75,
    streakDays: 3,
    lastStudyDate: '2024-01-15',
  },
  goals: {
    dailyStudyHours: 2,
    weeklyStudyHours: 14,
    monthlyStudyHours: 60,
  },
  loading: false,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addStudySession: (state, action: PayloadAction<StudySession>) => {
      state.studySessions.push(action.payload);
      // Update metrics
      const totalMinutes = state.studySessions.reduce((sum, session) => sum + session.duration, 0);
      state.metrics.totalStudyHours = totalMinutes / 60;
      state.metrics.averageProductivity = state.studySessions.reduce((sum, session) => sum + session.productivity, 0) / state.studySessions.length;
    },
    updateStudySession: (state, action: PayloadAction<StudySession>) => {
      const index = state.studySessions.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        state.studySessions[index] = action.payload;
      }
    },
    deleteStudySession: (state, action: PayloadAction<string>) => {
      state.studySessions = state.studySessions.filter(session => session.id !== action.payload);
    },
    updateMetrics: (state, action: PayloadAction<Partial<ProgressMetrics>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    updateGoals: (state, action: PayloadAction<Partial<ProgressState['goals']>>) => {
      state.goals = { ...state.goals, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  addStudySession, 
  updateStudySession, 
  deleteStudySession, 
  updateMetrics, 
  updateGoals, 
  setLoading 
} = progressSlice.actions;
export default progressSlice.reducer; 