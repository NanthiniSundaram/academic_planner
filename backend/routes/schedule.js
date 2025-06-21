import express from 'express';
import { body, validationResult } from 'express-validator';
import Schedule from '../models/Schedule.js';
import Task from '../models/Task.js';
import Course from '../models/Course.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/schedule
// @desc    Get schedule for a specific date or date range
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      query.date = {
        $gte: targetDate,
        $lt: nextDate
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const schedules = await Schedule.find(query)
      .populate('timeSlots.course', 'code name color')
      .populate('timeSlots.task', 'title type priority')
      .sort({ date: 1 });

    res.json(schedules);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/schedule
// @desc    Create or update schedule for a specific date
// @access  Private
router.post('/', protect, [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlots').isArray().withMessage('Time slots must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, timeSlots, notes } = req.body;
    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);

    // Check if schedule already exists for this date
    let schedule = await Schedule.findOne({
      user: req.user._id,
      date: scheduleDate
    });

    if (schedule) {
      // Update existing schedule
      schedule.timeSlots = timeSlots;
      schedule.notes = notes;
      schedule.totalStudyHours = calculateStudyHours(timeSlots);
    } else {
      // Create new schedule
      schedule = new Schedule({
        user: req.user._id,
        date: scheduleDate,
        timeSlots,
        notes,
        totalStudyHours: calculateStudyHours(timeSlots)
      });
    }

    const savedSchedule = await schedule.save();
    const populatedSchedule = await Schedule.findById(savedSchedule._id)
      .populate('timeSlots.course', 'code name color')
      .populate('timeSlots.task', 'title type priority');

    res.status(201).json(populatedSchedule);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/schedule/item
// @desc    Add a single item to a schedule
// @access  Private
router.post(
  '/item',
  protect,
  [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('title').notEmpty().withMessage('Title is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { date, startTime, endTime, type, course, task, title, description, location, color } = req.body;
      const scheduleDate = new Date(date);
      scheduleDate.setHours(0, 0, 0, 0);

      let schedule = await Schedule.findOne({
        user: req.user._id,
        date: scheduleDate,
      });

      if (!schedule) {
        schedule = new Schedule({
          user: req.user._id,
          date: scheduleDate,
          timeSlots: [],
        });
      }

      const newTimeSlot = {
        startTime,
        endTime,
        type,
        course,
        task,
        title,
        description,
        location,
        color,
      };

      schedule.timeSlots.push(newTimeSlot);

      const savedSchedule = await schedule.save();
      const populatedSchedule = await Schedule.findById(savedSchedule._id)
        .populate('timeSlots.course', 'code name color')
        .populate('timeSlots.task', 'title type priority');

      res.status(201).json(populatedSchedule);
    } catch (error) {
      console.error('Add schedule item error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/schedule/item/:itemId
// @desc    Update a single item in a schedule
// @access  Private
router.put('/item/:itemId', protect, async (req, res) => {
    try {
        const { itemId } = req.params;
        const schedule = await Schedule.findOne({
            "user": req.user._id,
            "timeSlots._id": itemId
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule item not found' });
        }

        const itemIndex = schedule.timeSlots.findIndex(
            (item) => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Schedule item not found' });
        }

        const { id, _id, ...updateData } = req.body;
        Object.assign(schedule.timeSlots[itemIndex], updateData);
        
        const savedSchedule = await schedule.save();
        
        const populatedSchedule = await Schedule.findById(savedSchedule._id)
            .populate('timeSlots.course', 'code name color')
            .populate('timeSlots.task', 'title type priority');

        res.json(populatedSchedule);
    } catch (error) {
        console.error('Update schedule item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/schedule/item/:itemId
// @desc    Delete a single item from a schedule
// @access  Private
router.delete('/item/:itemId', protect, async (req, res) => {
    try {
        const { itemId } = req.params;

        const schedule = await Schedule.findOne({ 
            "user": req.user._id, 
            "timeSlots._id": itemId 
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule item not found' });
        }

        schedule.timeSlots = schedule.timeSlots.filter(
            (item) => item._id.toString() !== itemId
        );

        await schedule.save();
        res.json({ message: 'Schedule item deleted successfully' });
    } catch (error) {
        console.error('Delete schedule item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/schedule/:id
// @desc    Update schedule
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('timeSlots.course', 'code name color')
    .populate('timeSlots.task', 'title type priority');

    res.json(updatedSchedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/schedule/:id/timeslot/:slotId
// @desc    Update specific time slot
// @access  Private
router.put('/:id/timeslot/:slotId', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this schedule' });
    }

    const timeSlot = schedule.timeSlots.id(req.params.slotId);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    Object.assign(timeSlot, req.body);
    await schedule.save();

    const updatedSchedule = await Schedule.findById(req.params.id)
      .populate('timeSlots.course', 'code name color')
      .populate('timeSlots.task', 'title type priority');

    res.json(updatedSchedule);
  } catch (error) {
    console.error('Update time slot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/schedule/suggestions
// @desc    Get AI-powered schedule suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = new Date(date || new Date());
    targetDate.setHours(0, 0, 0, 0);

    // Get user's pending tasks
    const pendingTasks = await Task.find({
      user: req.user._id,
      status: { $in: ['pending', 'in_progress'] },
      dueDate: { $gte: targetDate }
    })
    .populate('course', 'code name color')
    .sort({ dueDate: 1, priority: -1 });

    // Get user's courses for the day
    const user = await User.findById(req.user._id).populate('courses');
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    const courseSchedule = user.courses.filter(course => 
      course.schedule.some(schedule => schedule.day === dayOfWeek)
    );

    // Generate suggestions based on tasks and courses
    const suggestions = generateScheduleSuggestions(pendingTasks, courseSchedule, targetDate);

    res.json(suggestions);
  } catch (error) {
    console.error('Get schedule suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate study hours
const calculateStudyHours = (timeSlots) => {
  return timeSlots.reduce((total, slot) => {
    if (slot.type === 'study') {
      const start = new Date(`2000-01-01T${slot.startTime}`);
      const end = new Date(`2000-01-01T${slot.endTime}`);
      return total + (end - start) / (1000 * 60 * 60);
    }
    return total;
  }, 0);
};

// Helper function to generate schedule suggestions
const generateScheduleSuggestions = (tasks, courses, date) => {
  const suggestions = [];
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });

  // Add course schedule
  courses.forEach(course => {
    const courseSchedule = course.schedule.find(schedule => schedule.day === dayOfWeek);
    if (courseSchedule) {
      suggestions.push({
        startTime: courseSchedule.startTime,
        endTime: courseSchedule.endTime,
        type: 'class',
        course: course._id,
        title: `${course.code} - ${course.name}`,
        description: courseSchedule.type,
        location: courseSchedule.room
      });
    }
  });

  // Add task suggestions
  tasks.forEach((task, index) => {
    const priorityHours = {
      'urgent': 3,
      'high': 2.5,
      'medium': 2,
      'low': 1.5
    };

    const estimatedHours = task.estimatedHours || priorityHours[task.priority] || 2;
    
    // Suggest study time based on priority and due date
    const daysUntilDue = Math.ceil((new Date(task.dueDate) - date) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 3 || task.priority === 'urgent') {
      suggestions.push({
        startTime: '09:00',
        endTime: addHours('09:00', estimatedHours),
        type: 'study',
        task: task._id,
        course: task.course._id,
        title: `Study: ${task.title}`,
        description: `Due in ${daysUntilDue} days`,
        priority: task.priority
      });
    }
  });

  return suggestions.sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a.startTime}`);
    const timeB = new Date(`2000-01-01T${b.startTime}`);
    return timeA - timeB;
  });
};

// Helper function to add hours to time string
const addHours = (timeString, hours) => {
  const [hoursStr, minutesStr] = timeString.split(':');
  const totalMinutes = parseInt(hoursStr) * 60 + parseInt(minutesStr) + (hours * 60);
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

export default router; 