import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
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
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, updateProfile, setAuthenticated, setLoading } = userSlice.actions;
export default userSlice.reducer;
