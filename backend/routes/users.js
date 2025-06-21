import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
        .select('-password');
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', protect, async (req, res) => {
    try {
      const { name, major, year, preferences } = req.body;
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (name) user.name = name;
      if (major) user.major = major;
      if (year) user.year = year;
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }
  
      const updatedUser = await user.save();
      const userResponse = await User.findById(updatedUser._id)
        .select('-password')
        .populate('courses', 'code name color');
  
      res.json(userResponse);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
});


router.get('/dashboard', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      // Get upcoming tasks
      const Task = (await import('../models/Task.js')).default;
      const upcomingTasks = await Task.find({
        user: req.user._id,
        dueDate: { $gte: new Date() },
        status: { $ne: 'completed' }
      })
      .populate('course', 'code name color')
      .sort({ dueDate: 1 })
      .limit(5);
  
      // Get recent schedules
      const Schedule = (await import('../models/Schedule.js')).default;
      const recentSchedules = await Schedule.find({
        user: req.user._id,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
      .populate('timeSlots.course', 'code name color')
      .sort({ date: -1 })
      .limit(7);
  
      const dashboardData = {
        user: {
          name: user.name,
          major: user.major,
          year: user.year,
          courses: user.courses
        },
        upcomingTasks,
        recentSchedules,
        stats: {
          totalCourses: user.courses.length,
          totalTasks: upcomingTasks.length,
          studyStreak: 0 // This would be calculated from schedules
        }
      };
  
      res.json(dashboardData);
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({ message: 'Server error' });
    }
});
  
export default router; 