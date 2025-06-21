import express from 'express';
import { body, validationResult } from 'express-validator';
import Progress from '../models/Progress.js';
import Task from '../models/Task.js';
import Schedule from '../models/Schedule.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/progress
// @desc    Get progress for all courses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { semester, year } = req.query;
    let query = { user: req.user._id };

    if (semester) query.semester = semester;
    if (year) query.year = parseInt(year);

    const progress = await Progress.find(query)
      .populate('course', 'code name color')
      .sort({ semester: -1, year: -1 });

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/:courseId
// @desc    Get progress for specific course
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    }).populate('course', 'code name color');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress
// @desc    Create or update progress for a course
// @access  Private
router.post('/', protect, [
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('semester').isIn(['fall', 'spring', 'summer']).withMessage('Invalid semester'),
  body('year').isInt({ min: 2020 }).withMessage('Invalid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { course, semester, year, targetGrade } = req.body;

    // Check if progress already exists
    let progress = await Progress.findOne({
      user: req.user._id,
      course,
      semester,
      year
    });

    if (progress) {
      // Update existing progress
      progress.targetGrade = targetGrade || progress.targetGrade;
      const updatedProgress = await progress.save();
      const populatedProgress = await Progress.findById(updatedProgress._id)
        .populate('course', 'code name color');
      res.json(populatedProgress);
    } else {
      // Create new progress
      progress = new Progress({
        user: req.user._id,
        course,
        semester,
        year,
        targetGrade
      });

      const savedProgress = await progress.save();
      const populatedProgress = await Progress.findById(savedProgress._id)
        .populate('course', 'code name color');
      res.status(201).json(populatedProgress);
    }
  } catch (error) {
    console.error('Create progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/progress/:id
// @desc    Update progress
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this progress' });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'code name color');

    res.json(updatedProgress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress/:id/grade
// @desc    Add a grade to progress
// @access  Private
router.post('/:id/grade', protect, [
  body('task').isMongoId().withMessage('Valid task ID is required'),
  body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('maxScore').optional().isFloat({ min: 1 }).withMessage('Max score must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this progress' });
    }

    const { task, score, maxScore = 100, feedback } = req.body;

    // Check if grade already exists for this task
    const existingGradeIndex = progress.grades.findIndex(grade => 
      grade.task.toString() === task
    );

    if (existingGradeIndex !== -1) {
      // Update existing grade
      progress.grades[existingGradeIndex] = {
        task,
        score,
        maxScore,
        feedback,
        submittedAt: new Date()
      };
    } else {
      // Add new grade
      progress.grades.push({
        task,
        score,
        maxScore,
        feedback,
        submittedAt: new Date()
      });
    }

    // Update progress statistics
    await updateProgressStats(progress);

    const savedProgress = await progress.save();
    const populatedProgress = await Progress.findById(savedProgress._id)
      .populate('course', 'code name color');

    res.json(populatedProgress);
  } catch (error) {
    console.error('Add grade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/analytics/overview
// @desc    Get overall progress analytics
// @access  Private
router.get('/analytics/overview', protect, async (req, res) => {
  try {
    const { semester, year } = req.query;
    let query = { user: req.user._id };

    if (semester) query.semester = semester;
    if (year) query.year = parseInt(year);

    const progress = await Progress.find(query).populate('course', 'code name color');
    const tasks = await Task.find({ user: req.user._id });
    const schedules = await Schedule.find({ user: req.user._id });

    const analytics = generateProgressAnalytics(progress, tasks, schedules);
    res.json(analytics);
  } catch (error) {
    console.error('Get progress analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/analytics/course/:courseId
// @desc    Get detailed analytics for a specific course
// @access  Private
router.get('/analytics/course/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    }).populate('course', 'code name color');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const tasks = await Task.find({
      user: req.user._id,
      course: req.params.courseId
    });

    const courseAnalytics = generateCourseAnalytics(progress, tasks);
    res.json(courseAnalytics);
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update progress statistics
const updateProgressStats = async (progress) => {
  // Update task counts
  const tasks = await Task.find({
    user: progress.user,
    course: progress.course
  });

  progress.totalTasks = tasks.length;
  progress.completedTasks = tasks.filter(task => task.status === 'completed').length;

  // Update study hours
  const schedules = await Schedule.find({
    user: progress.user,
    date: {
      $gte: new Date(new Date().getFullYear(), 0, 1), // Start of year
      $lte: new Date(new Date().getFullYear(), 11, 31) // End of year
    }
  });

  progress.totalStudyHours = schedules.reduce((total, schedule) => {
    return total + (schedule.actualStudyHours || 0);
  }, 0);

  // Update average productivity
  const productivityScores = schedules
    .filter(schedule => schedule.productivity > 0)
    .map(schedule => schedule.productivity);

  progress.averageProductivity = productivityScores.length > 0
    ? productivityScores.reduce((sum, score) => sum + score, 0) / productivityScores.length
    : 5;

  // Update current grade
  if (progress.grades.length > 0) {
    const totalScore = progress.grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalMaxScore = progress.grades.reduce((sum, grade) => sum + grade.maxScore, 0);
    progress.currentGrade = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
  }

  // Update study streak
  const sortedSchedules = schedules.sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);

    const hasStudySession = sortedSchedules.some(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === checkDate.toDateString() &&
             schedule.actualStudyHours > 0;
    });

    if (hasStudySession) {
      streak++;
    } else {
      break;
    }
  }

  progress.studyStreak = streak;
  progress.lastStudyDate = sortedSchedules.length > 0 ? sortedSchedules[0].date : null;
};

// Helper function to generate progress analytics
const generateProgressAnalytics = (progress, tasks, schedules) => {
  const analytics = {
    overallGrade: 0,
    totalCourses: progress.length,
    totalTasks: 0,
    completedTasks: 0,
    totalStudyHours: 0,
    averageProductivity: 0,
    studyStreak: 0,
    coursePerformance: [],
    weeklyGoals: []
  };

  // Calculate overall statistics
  let totalGrade = 0;
  let coursesWithGrades = 0;

  progress.forEach(courseProgress => {
    analytics.totalTasks += courseProgress.totalTasks;
    analytics.completedTasks += courseProgress.completedTasks;
    analytics.totalStudyHours += courseProgress.totalStudyHours;
    analytics.studyStreak = Math.max(analytics.studyStreak, courseProgress.studyStreak);

    if (courseProgress.currentGrade > 0) {
      totalGrade += courseProgress.currentGrade;
      coursesWithGrades++;
    }

    analytics.coursePerformance.push({
      course: courseProgress.course,
      currentGrade: courseProgress.currentGrade,
      targetGrade: courseProgress.targetGrade,
      completionRate: courseProgress.totalTasks > 0 
        ? (courseProgress.completedTasks / courseProgress.totalTasks) * 100 
        : 0
    });
  });

  analytics.overallGrade = coursesWithGrades > 0 ? totalGrade / coursesWithGrades : 0;

  // Calculate average productivity
  const productivityScores = schedules
    .filter(schedule => schedule.productivity > 0)
    .map(schedule => schedule.productivity);

  analytics.averageProductivity = productivityScores.length > 0
    ? productivityScores.reduce((sum, score) => sum + score, 0) / productivityScores.length
    : 0;

  // Generate weekly goals
  const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));
  
  analytics.weeklyGoals = progress.map(courseProgress => ({
    course: courseProgress.course.code,
    week: currentWeek,
    targetHours: 10,
    actualHours: courseProgress.totalStudyHours,
    targetTasks: 5,
    completedTasks: courseProgress.completedTasks,
    achieved: courseProgress.completedTasks >= 5
  }));

  return analytics;
};

// Helper function to generate course-specific analytics
const generateCourseAnalytics = (progress, tasks) => {
  const analytics = {
    course: progress.course,
    currentGrade: progress.currentGrade,
    targetGrade: progress.targetGrade,
    gradeTrend: [],
    taskBreakdown: {},
    studyPatterns: {},
    recommendations: []
  };

  // Generate grade trend
  const sortedGrades = progress.grades.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
  let cumulativeScore = 0;
  let cumulativeMaxScore = 0;

  sortedGrades.forEach((grade, index) => {
    cumulativeScore += grade.score;
    cumulativeMaxScore += grade.maxScore;
    const averageGrade = cumulativeMaxScore > 0 ? (cumulativeScore / cumulativeMaxScore) * 100 : 0;
    
    analytics.gradeTrend.push({
      week: index + 1,
      grade: averageGrade,
      assignment: grade.task
    });
  });

  // Task breakdown by type
  const taskTypes = {};
  tasks.forEach(task => {
    if (!taskTypes[task.type]) {
      taskTypes[task.type] = { total: 0, completed: 0 };
    }
    taskTypes[task.type].total++;
    if (task.status === 'completed') {
      taskTypes[task.type].completed++;
    }
  });

  analytics.taskBreakdown = taskTypes;

  // Study patterns
  analytics.studyPatterns = {
    totalHours: progress.totalStudyHours,
    averageProductivity: progress.averageProductivity,
    studyStreak: progress.studyStreak,
    lastStudyDate: progress.lastStudyDate
  };

  // Generate recommendations
  if (progress.currentGrade < progress.targetGrade) {
    analytics.recommendations.push({
      type: 'grade',
      message: `Your current grade (${progress.currentGrade.toFixed(1)}%) is below your target (${progress.targetGrade}%).`,
      action: 'Focus on upcoming assignments and exams'
    });
  }

  if (progress.studyStreak < 3) {
    analytics.recommendations.push({
      type: 'consistency',
      message: 'Your study streak is low. Try to study consistently.',
      action: 'Establish a daily study routine'
    });
  }

  const completionRate = progress.totalTasks > 0 ? (progress.completedTasks / progress.totalTasks) * 100 : 0;
  if (completionRate < 70) {
    analytics.recommendations.push({
      type: 'completion',
      message: `Your task completion rate is ${completionRate.toFixed(1)}%.`,
      action: 'Focus on completing pending tasks'
    });
  }

  return analytics;
};

export default router; 