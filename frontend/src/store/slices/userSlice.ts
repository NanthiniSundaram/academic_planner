import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

export interface UserProfile extends User {
  studyPreferences: {
    preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
    sessionDuration: number; // in minutes
    breakDuration: number; // in minutes
    studyDaysPerWeek: number;
  };
  academicGoals: string[];
  avatar?: string;
}

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: UserState = {
  profile: {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    studentId: '12345',
    major: 'Computer Science',
    year: 'Senior',
    preferences: {},
    studyPreferences: {
      preferredStudyTime: 'morning',
      sessionDuration: 60,
      breakDuration: 15,
      studyDaysPerWeek: 5,
    },
    academicGoals: ['Maintain GPA above 3.5', 'Complete thesis by March', 'Improve time management'],
  },
  isAuthenticated: true,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, updateProfile, setAuthenticated, setLoading } = userSlice.actions;
export default userSlice.reducer;