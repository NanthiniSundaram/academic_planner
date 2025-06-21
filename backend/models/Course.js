import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1
  },
  instructor: {
    name: String,
    email: String
  },
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String,
    room: String,
    type: {
      type: String,
      enum: ['lecture', 'lab', 'tutorial', 'seminar']
    }
  }],
  semester: {
    type: String,
    enum: ['fall', 'spring', 'summer'],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course; 