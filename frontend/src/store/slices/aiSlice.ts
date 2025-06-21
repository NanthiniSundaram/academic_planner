import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudyTip {
  id: string;
  title: string;
  content: string;
  category: 'productivity' | 'health' | 'learning' | 'motivation';
  priority: number;
  createdAt: string;
}

interface AIRecommendation {
  id: string;
  type: 'schedule' | 'study-method' | 'break' | 'priority';
  title: string;
  description: string;
  action?: string;
  confidence: number;
  createdAt: string;
}

interface AIState {
  studyTips: StudyTip[];
  recommendations: AIRecommendation[];
  insights: {
    productivityScore: number;
    weeklyStudyHours: number;
    completionRate: number;
    streakDays: number;
  };
  loading: boolean;
}

const initialState: AIState = {
  studyTips: [
    {
      id: '1',
      title: 'Optimal Study Time Detected',
      content: 'Based on your productivity patterns, you perform best during 10-12 AM. Consider scheduling important tasks during this window.',
      category: 'productivity',
      priority: 5,
      createdAt: '2024-01-15T09:00:00',
    },
    {
      id: '2',
      title: 'Take Regular Breaks',
      content: 'Research shows that taking a 10-15 minute break every hour can improve focus and retention by up to 23%.',
      category: 'health',
      priority: 4,
      createdAt: '2024-01-15T10:00:00',
    },
    {
      id: '3',
      title: 'Active Recall Technique',
      content: 'Try explaining concepts aloud or teaching them to someone else. This active recall method is 50% more effective than passive reading.',
      category: 'learning',
      priority: 5,
      createdAt: '2024-01-15T11:00:00',
    },
  ],
  recommendations: [
    {
      id: '1',
      type: 'schedule',
      title: 'Reschedule Neural Network Study',
      description: 'Your current study session conflicts with your most productive hours. Consider moving it to 10 AM tomorrow.',
      action: 'Reschedule to 10:00 AM',
      confidence: 85,
      createdAt: '2024-01-15T09:30:00',
    },
    {
      id: '2',
      type: 'priority',
      title: 'Focus on Urgent Tasks',
      description: 'You have 2 urgent tasks due this week. Consider prioritizing the Software Engineering exam preparation.',
      action: 'Prioritize exam prep',
      confidence: 92,
      createdAt: '2024-01-15T10:30:00',
    },
  ],
  insights: {
    productivityScore: 78,
    weeklyStudyHours: 24,
    completionRate: 82,
    streakDays: 7,
  },
  loading: false,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setStudyTips: (state, action: PayloadAction<StudyTip[]>) => {
      state.studyTips = action.payload;
    },
    addStudyTip: (state, action: PayloadAction<StudyTip>) => {
      state.studyTips.push(action.payload);
    },
    setRecommendations: (state, action: PayloadAction<AIRecommendation[]>) => {
      state.recommendations = action.payload;
    },
    addRecommendation: (state, action: PayloadAction<AIRecommendation>) => {
      state.recommendations.push(action.payload);
    },
    dismissRecommendation: (state, action: PayloadAction<string>) => {
      state.recommendations = state.recommendations.filter(rec => rec.id !== action.payload);
    },
    setInsights: (state, action: PayloadAction<Partial<AIState['insights']>>) => {
      state.insights = { ...state.insights, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setStudyTips, addStudyTip, setRecommendations, addRecommendation, dismissRecommendation, setInsights, setLoading } = aiSlice.actions;
export default aiSlice.reducer;