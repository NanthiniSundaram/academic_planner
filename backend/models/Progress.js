import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  totalStudyHours: {
    type: Number,
    default: 0
  },
  averageProductivity: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  grades: [{
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    maxScore: {
      type: Number,
      default: 100
    },
    feedback: String,
    submittedAt: Date
  }],
  currentGrade: {
    type: Number,
    min: 0,
    max: 100
  },
  targetGrade: {
    type: Number,
    min: 0,
    max: 100
  },
  studyStreak: {
    type: Number,
    default: 0
  },
  lastStudyDate: Date,
  weeklyGoals: [{
    week: Number,
    targetHours: Number,
    actualHours: Number,
    targetTasks: Number,
    completedTasks: Number,
    achieved: Boolean
  }],
  strengths: [String],
  weaknesses: [String],
  improvementAreas: [String]
}, {
  timestamps: true
});

// Index for efficient queries
progressSchema.index({ user: 1, course: 1 });
progressSchema.index({ user: 1, semester: 1, year: 1 });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress; 