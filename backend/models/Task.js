import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['assignment', 'exam', 'quiz', 'project', 'presentation', 'lab', 'other'],
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  estimatedHours: {
    type: Number,
    min: 0.5,
    default: 2
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  weight: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  notes: String,
  completedAt: Date,
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ course: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task; 