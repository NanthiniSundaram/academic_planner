import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { status, course, priority, type } = req.query;
    let query = { user: req.user._id };

    if (status) query.status = status;
    if (course) query.course = course;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    const tasks = await Task.find(query)
      .populate('course', 'code name color')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, [
  body('title').notEmpty().withMessage('Task title is required'),
  body('type').isIn(['assignment', 'exam', 'quiz', 'project', 'presentation', 'lab', 'other']).withMessage('Invalid task type'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      type,
      course,
      dueDate,
      priority,
      estimatedHours,
      weight,
      tags
    } = req.body;

    const task = new Task({
      title,
      description,
      type,
      course,
      user: req.user._id,
      dueDate,
      priority: priority || 'medium',
      estimatedHours: estimatedHours || 2,
      weight: weight || 10,
      tags: tags || []
    });

    const savedTask = await task.save();
    const populatedTask = await Task.findById(savedTask._id).populate('course', 'code name color');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/upcoming', protect, async (req, res) => {
    try {
      const { days = 7 } = req.query;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(days));
  
      const tasks = await Task.find({
        user: req.user._id,
        dueDate: { $lte: endDate },
        status: { $ne: 'completed' }
      });
  
      res.json(tasks);
    } catch (error) {
      console.error('Get upcoming tasks error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('course', 'code name color');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'code name color');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/status', protect, [
  body('status').isIn(['pending', 'in_progress', 'completed', 'overdue']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = req.body.status;
    if (req.body.status === 'completed') {
      task.completedAt = new Date();
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate('course', 'code name color');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export const  taskRoutes = router; 