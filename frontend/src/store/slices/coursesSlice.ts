import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  color: string;
  instructor: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    location: string;
  }[];
  description?: string;
}

interface CoursesState {
  courses: Course[];
  selectedCourse: Course | null;
  loading: boolean;
}

const initialState: CoursesState = {
  courses: [
    {
      id: '1',
      name: 'Advanced Machine Learning',
      code: 'CS 6340',
      credits: 3,
      color: '#3B82F6',
      instructor: 'Dr. Smith',
      schedule: [
        { day: 'Monday', startTime: '10:00', endTime: '11:30', location: 'Room 301' },
        { day: 'Wednesday', startTime: '10:00', endTime: '11:30', location: 'Room 301' },
      ],
      description: 'Deep dive into advanced machine learning algorithms and neural networks.',
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS 5320',
      credits: 3,
      color: '#8B5CF6',
      instructor: 'Prof. Johnson',
      schedule: [
        { day: 'Tuesday', startTime: '14:00', endTime: '15:30', location: 'Room 205' },
        { day: 'Thursday', startTime: '14:00', endTime: '15:30', location: 'Room 205' },
      ],
      description: 'Comprehensive study of database design, optimization, and management.',
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CS 4510',
      credits: 3,
      color: '#10B981',
      instructor: 'Dr. Brown',
      schedule: [
        { day: 'Monday', startTime: '13:00', endTime: '14:30', location: 'Room 102' },
        { day: 'Friday', startTime: '13:00', endTime: '14:30', location: 'Room 102' },
      ],
      description: 'Best practices in software development, testing, and project management.',
    },
  ],
  selectedCourse: null,
  loading: false,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
      state.selectedCourse = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCourses, addCourse, updateCourse, deleteCourse, setSelectedCourse, setLoading } = coursesSlice.actions;
export default coursesSlice.reducer;