import express from 'express';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('courses');
    res.json(user.courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, [
  body('code').notEmpty().withMessage('Course code is required'),
  body('name').notEmpty().withMessage('Course name is required'),
  body('credits').isInt({ min: 1 }).withMessage('Credits must be at least 1'),
  body('semester').isIn(['fall', 'spring', 'summer']).withMessage('Invalid semester'),
  body('year').isInt({ min: 2020 }).withMessage('Invalid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, description, credits, instructor, schedule, semester, year, difficulty, color } = req.body;

    // Check if course already exists for this user
    const existingCourse = await Course.findOne({ 
      code, 
      semester, 
      year, 
      students: req.user._id 
    });

    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists for this semester' });
    }

    const course = new Course({
      code,
      name,
      description,
      credits,
      instructor,
      schedule,
      semester,
      year,
      difficulty,
      color,
      students: [req.user._id]
    });

    const savedCourse = await course.save();

    // Add course to user's course list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { courses: savedCourse._id }
    });

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled in this course
    if (!course.students.some(student => student._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this course' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled in this course
    if (!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled in this course
    if (!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    // Remove course from user's course list
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { courses: req.params.id }
    });

    // Remove user from course's student list
    course.students = course.students.filter(student => student.toString() !== req.user._id.toString());
    
    if (course.students.length === 0) {
      // If no students left, delete the course
      await Course.findByIdAndDelete(req.params.id);
    } else {
      await course.save();
    }

    res.json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 