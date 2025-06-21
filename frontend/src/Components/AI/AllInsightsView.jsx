import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { dismissRecommendation } from '../../store/slices/aiSlice';
import { Brain, TrendingUp, Lightbulb, Target, Clock, X, CheckCircle } from 'lucide-react';

const AIInsightsView = () => {
  const dispatch = useAppDispatch();
  const { studyTips, recommendations, insights } = useAppSelector((state) => state.ai);
  const { tasks } = useAppSelector((state) => state.tasks);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'productivity': return TrendingUp;
      case 'health': return Clock;
      case 'learning': return Lightbulb;
      case 'motivation': return Target;
      default: return Brain;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'productivity': return 'from-green-400 to-blue-500';
      case 'health': return 'from-blue-400 to-purple-500';
      case 'learning': return 'from-purple-400 to-pink-500';
      case 'motivation': return 'from-pink-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'schedule': return Clock;
      case 'study-method': return Lightbulb;
      case 'break': return Clock;
      case 'priority': return Target;
      default: return Brain;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-gray-500">Personalized recommendations and productivity insights</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{insights.productivityScore}%</div>
              <div className="text-sm opacity-90">Productivity Score</div>
            </div>
          </div>
          <div className="text-sm opacity-75">+5% from last week</div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{insights.weeklyStudyHours}h</div>
              <div className="text-sm opacity-90">Study Hours</div>
            </div>
          </div>
          <div className="text-sm opacity-75">This week</div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{insights.completionRate}%</div>
              <div className="text-sm opacity-90">Completion Rate</div>
            </div>
          </div>
          <div className="text-sm opacity-75">Tasks completed</div>
        </div>

        <div className="bg-gradient-to-r from-pink-400 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <div className="text-right">
              <div className="text-3xl font-bold">{insights.streakDays}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
          </div>
          <div className="text-sm opacity-75">Consecutive days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => {
              const Icon = getRecommendationIcon(rec.type);
              return (
                <div key={rec.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-purple-600" />
                      <h4 className="font-medium text-purple-900">{rec.title}</h4>
                    </div>
                    <button
                      onClick={() => dispatch(dismissRecommendation(rec.id))}
                      className="text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-purple-700 mb-3">{rec.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {rec.confidence}% confidence
                      </div>
                      <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {rec.type}
                      </div>
                    </div>
                    
                    {rec.action && (
                      <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors">
                        {rec.action}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Study Tips</h3>
          </div>

          <div className="space-y-4">
            {studyTips.map((tip) => {
              const Icon = getCategoryIcon(tip.category);
              const colorClass = getCategoryColor(tip.category);
              
              return (
                <div key={tip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{tip.content}</p>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tip.category}
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full mx-0.5 ${
                                i < tip.priority ? 'bg-yellow-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Productivity Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Productivity Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">Peak Hours</div>
            <div className="text-sm text-gray-600 mb-4">Most productive time</div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-green-800">10:00 AM - 12:00 PM</div>
              <div className="text-sm text-green-600">85% efficiency rate</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">Focus Time</div>
            <div className="text-sm text-gray-600 mb-4">Average session length</div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-800">45 minutes</div>
              <div className="text-sm text-blue-600">Optimal for deep work</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">Break Pattern</div>
            <div className="text-sm text-gray-600 mb-4">Recommended intervals</div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-lg font-semibold text-purple-800">Every 60 minutes</div>
              <div className="text-sm text-purple-600">15-minute breaks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsView;