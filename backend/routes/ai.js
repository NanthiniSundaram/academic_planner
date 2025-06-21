import express from 'express';
import natural from 'natural';
import Task from '../models/Task.js';
import Progress from '../models/Progress.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Initialize tokenizer
const tokenizer = new natural.WordTokenizer();

// @route   GET /api/ai/tips
// @desc    Get personalized study tips
// @access  Private
router.get('/tips', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tasks = await Task.find({ user: req.user._id, status: { $ne: 'completed' } });
    const progress = await Progress.find({ user: req.user._id });

    const tips = generateStudyTips(user, tasks, progress);
    res.json(tips);
  } catch (error) {
    console.error('Get AI tips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ai/recommendations
// @desc    Get task and study recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .populate('course', 'code name difficulty')
      .sort({ dueDate: 1 });

    const recommendations = generateRecommendations(tasks);
    res.json(recommendations);
  } catch (error) {
    console.error('Get AI recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/analyze-task
// @desc    Analyze task content and provide insights
// @access  Private
router.post('/analyze-task', protect, async (req, res) => {
  try {
    const { title, description, type, course } = req.body;
    
    const analysis = analyzeTaskContent(title, description, type);
    res.json(analysis);
  } catch (error) {
    console.error('Analyze task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ai/productivity-insights
// @desc    Get productivity insights and analytics
// @access  Private
router.get('/productivity-insights', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const schedules = await Schedule.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const tasks = await Task.find({
      user: req.user._id,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const insights = generateProductivityInsights(schedules, tasks, parseInt(days));
    res.json(insights);
  } catch (error) {
    console.error('Get productivity insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate study tips
const generateStudyTips = (user, tasks, progress) => {
  const tips = [];

  // Analyze task distribution
  const urgentTasks = tasks.filter(task => task.priority === 'urgent');
  const overdueTasks = tasks.filter(task => task.status === 'overdue');

  if (urgentTasks.length > 3) {
    tips.push({
      type: 'warning',
      title: 'High Priority Tasks',
      message: `You have ${urgentTasks.length} urgent tasks. Consider breaking them down into smaller, manageable chunks.`,
      action: 'Review and prioritize your tasks'
    });
  }

  if (overdueTasks.length > 0) {
    tips.push({
      type: 'alert',
      title: 'Overdue Tasks',
      message: `You have ${overdueTasks.length} overdue tasks. Focus on completing these first to avoid falling behind.`,
      action: 'Complete overdue tasks immediately'
    });
  }

  // Analyze study patterns
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (completionRate < 70) {
    tips.push({
      type: 'improvement',
      title: 'Task Completion Rate',
      message: `Your task completion rate is ${completionRate.toFixed(1)}%. Try setting smaller, more achievable goals.`,
      action: 'Break down large tasks into smaller ones'
    });
  }

  // Course-specific tips
  const courseTasks = {};
  tasks.forEach(task => {
    if (task.course) {
      if (!courseTasks[task.course]) {
        courseTasks[task.course] = [];
      }
      courseTasks[task.course].push(task);
    }
  });

  Object.entries(courseTasks).forEach(([courseId, courseTaskList]) => {
    const pendingTasks = courseTaskList.filter(task => task.status !== 'completed');
    if (pendingTasks.length > 5) {
      tips.push({
        type: 'info',
        title: 'Course Workload',
        message: `You have ${pendingTasks.length} pending tasks for this course. Consider creating a study schedule.`,
        action: 'Create a dedicated study plan for this course'
      });
    }
  });

  // General productivity tips
  tips.push({
    type: 'tip',
    title: 'Study Environment',
    message: 'Find a quiet, well-lit space to study. Eliminate distractions and use the Pomodoro technique.',
    action: 'Create an optimal study environment'
  });

  tips.push({
    type: 'tip',
    title: 'Regular Breaks',
    message: 'Take short breaks every 25-30 minutes to maintain focus and prevent burnout.',
    action: 'Schedule regular study breaks'
  });

  return tips;
};

// Helper function to generate recommendations
const generateRecommendations = (tasks) => {
  const recommendations = {
    priorityTasks: [],
    studySchedule: [],
    timeManagement: []
  };

  // Priority task recommendations
  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && task.status !== 'completed');
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed');
  
  recommendations.priorityTasks = [...urgentTasks, ...highPriorityTasks]
    .slice(0, 5)
    .map(task => ({
      id: task._id,
      title: task.title,
      course: task.course?.code || 'Unknown',
      dueDate: task.dueDate,
      priority: task.priority,
      estimatedHours: task.estimatedHours
    }));

  // Study schedule recommendations
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingTasks = tasks.filter(task => 
    task.dueDate >= today && 
    task.dueDate <= nextWeek && 
    task.status !== 'completed'
  );

  recommendations.studySchedule = upcomingTasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 10)
    .map(task => ({
      id: task._id,
      title: task.title,
      course: task.course?.code || 'Unknown',
      dueDate: task.dueDate,
      suggestedStudyTime: calculateSuggestedStudyTime(task)
    }));

  // Time management recommendations
  const totalEstimatedHours = tasks
    .filter(task => task.status !== 'completed')
    .reduce((sum, task) => sum + (task.estimatedHours || 2), 0);

  if (totalEstimatedHours > 40) {
    recommendations.timeManagement.push({
      type: 'warning',
      message: 'You have a heavy workload. Consider delegating or requesting extensions.',
      action: 'Review your commitments'
    });
  }

  return recommendations;
};

// Helper function to analyze task content
const analyzeTaskContent = (title, description, type) => {
  const analysis = {
    complexity: 'medium',
    estimatedTime: 2,
    keywords: [],
    suggestions: []
  };

  // Extract keywords
  const text = `${title} ${description || ''}`.toLowerCase();
  const words = tokenizer.tokenize(text);
  const keywords = words.filter(word => word.length > 3);
  analysis.keywords = [...new Set(keywords)].slice(0, 10);

  // Analyze complexity based on keywords
  const complexKeywords = ['research', 'analysis', 'presentation', 'project', 'thesis', 'dissertation'];
  const simpleKeywords = ['review', 'summary', 'quiz', 'homework', 'reading'];

  const complexityScore = complexKeywords.filter(keyword => 
    text.includes(keyword)
  ).length - simpleKeywords.filter(keyword => 
    text.includes(keyword)
  ).length;

  if (complexityScore > 1) {
    analysis.complexity = 'high';
    analysis.estimatedTime = 4;
  } else if (complexityScore < -1) {
    analysis.complexity = 'low';
    analysis.estimatedTime = 1;
  }

  // Generate suggestions based on type and content
  if (type === 'presentation') {
    analysis.suggestions.push('Start with an outline and practice your delivery');
    analysis.suggestions.push('Create visual aids to support your points');
  } else if (type === 'project') {
    analysis.suggestions.push('Break down the project into smaller milestones');
    analysis.suggestions.push('Set intermediate deadlines for each component');
  } else if (type === 'exam') {
    analysis.suggestions.push('Create a study guide with key concepts');
    analysis.suggestions.push('Practice with past exams or sample questions');
  }

  return analysis;
};

// Helper function to generate productivity insights
const generateProductivityInsights = (schedules, tasks, days) => {
  const insights = {
    totalStudyHours: 0,
    averageProductivity: 0,
    taskCompletionRate: 0,
    studyStreak: 0,
    recommendations: []
  };

  // Calculate total study hours
  insights.totalStudyHours = schedules.reduce((total, schedule) => {
    return total + (schedule.actualStudyHours || 0);
  }, 0);

  // Calculate average productivity
  const productivityScores = schedules
    .filter(schedule => schedule.productivity > 0)
    .map(schedule => schedule.productivity);
  
  insights.averageProductivity = productivityScores.length > 0 
    ? productivityScores.reduce((sum, score) => sum + score, 0) / productivityScores.length 
    : 0;

  // Calculate task completion rate
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  insights.taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate study streak
  const sortedSchedules = schedules.sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < days; i++) {
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
  
  insights.studyStreak = streak;

  // Generate recommendations
  if (insights.averageProductivity < 6) {
    insights.recommendations.push({
      type: 'productivity',
      message: 'Your productivity score is below average. Try using the Pomodoro technique.',
      action: 'Implement time management techniques'
    });
  }

  if (insights.taskCompletionRate < 70) {
    insights.recommendations.push({
      type: 'completion',
      message: 'Your task completion rate could be improved. Set smaller, more achievable goals.',
      action: 'Break down large tasks'
    });
  }

  if (insights.studyStreak < 3) {
    insights.recommendations.push({
      type: 'consistency',
      message: 'Try to maintain a consistent study schedule. Even 30 minutes daily is better than long sessions occasionally.',
      action: 'Establish a daily study routine'
    });
  }

  return insights;
};

// Helper function to calculate suggested study time
const calculateSuggestedStudyTime = (task) => {
  const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const estimatedHours = task.estimatedHours || 2;
  
  if (daysUntilDue <= 1) {
    return Math.min(estimatedHours, 4); // Max 4 hours per day
  } else if (daysUntilDue <= 3) {
    return Math.min(estimatedHours / 2, 3); // Spread over 2 days
  } else {
    return Math.min(estimatedHours / Math.max(daysUntilDue - 1, 1), 2); // Spread over available days
  }
};

export default router; 