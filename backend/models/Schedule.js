import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlots: [{
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['study', 'class', 'break', 'exam', 'meeting'],
      default: 'study'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    title: String,
    description: String,
    location: String,
    isCompleted: {
      type: Boolean,
      default: false
    },
    actualStartTime: String,
    actualEndTime: String,
    notes: String
  }],
  totalStudyHours: {
    type: Number,
    default: 0
  },
  actualStudyHours: {
    type: Number,
    default: 0
  },
  productivity: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient queries
scheduleSchema.index({ user: 1, date: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule; 