import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { PredictionResult } from '../types';

interface AnalyticsProps {
  predictions: PredictionResult[];
}

const Analytics: React.FC<AnalyticsProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Analytics Dashboard</h2>
          <p className="text-slate-600">
            Start making predictions to see detailed analytics and insights
          </p>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalStudents = predictions.length;
  const averageGPA = predictions.reduce((sum, p) => sum + p.predictedGPA, 0) / totalStudents;
  const averageExamScore = predictions.reduce((sum, p) => sum + p.predictedFinalExam, 0) / totalStudents;
  const averageConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / totalStudents;

  const riskDistribution = {
    high: predictions.filter(p => p.riskLevel === 'high').length,
    medium: predictions.filter(p => p.riskLevel === 'medium').length,
    low: predictions.filter(p => p.riskLevel === 'low').length,
  };

  const gpaDistribution = {
    'A (3.5-4.0)': predictions.filter(p => p.predictedGPA >= 3.5).length,
    'B (2.5-3.4)': predictions.filter(p => p.predictedGPA >= 2.5 && p.predictedGPA < 3.5).length,
    'C (1.5-2.4)': predictions.filter(p => p.predictedGPA >= 1.5 && p.predictedGPA < 2.5).length,
    'D-F (0-1.4)': predictions.filter(p => p.predictedGPA < 1.5).length,
  };

  const performanceFactors = [
    {
      factor: 'Attendance Rate',
      average: predictions.reduce((sum, p) => sum + p.student.attendanceRate, 0) / totalStudents,
      impact: 'High',
      color: 'text-red-600 bg-red-50',
    },
    {
      factor: 'Quiz Average',
      average: predictions.reduce((sum, p) => sum + p.student.quizAverage, 0) / totalStudents,
      impact: 'High',
      color: 'text-red-600 bg-red-50',
    },
    {
      factor: 'Assignment Average',
      average: predictions.reduce((sum, p) => sum + p.student.assignmentAverage, 0) / totalStudents,
      impact: 'Medium',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      factor: 'Final Project Score',
      average: predictions.reduce((sum, p) => sum + p.student.finalProjectScore, 0) / totalStudents,
      impact: 'Medium',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      factor: 'Participation Level',
      average: predictions.reduce((sum, p) => sum + p.student.participationLevel, 0) / totalStudents,
      impact: 'Low',
      color: 'text-green-600 bg-green-50',
    },
    {
      factor: 'Study Hours',
      average: predictions.reduce((sum, p) => sum + p.student.studyHours, 0) / totalStudents,
      impact: 'Low',
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">{totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average GPA</p>
                <p className="text-2xl font-bold text-green-800 mt-1">{averageGPA.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Exam Score</p>
                <p className="text-2xl font-bold text-purple-800 mt-1">{averageExamScore.toFixed(0)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Model Confidence</p>
                <p className="text-2xl font-bold text-orange-800 mt-1">{(averageConfidence * 100).toFixed(0)}%</p>
              </div>
              <PieChart className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Level Distribution</h3>
            <div className="space-y-4">
              {Object.entries(riskDistribution).map(([level, count]) => {
                const percentage = (count / totalStudents) * 100;
                const colors = {
                  high: 'bg-red-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-green-500'
                };
                
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize text-slate-700">{level} Risk</span>
                      <span className="text-sm text-slate-600">{count} students ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${colors[level as keyof typeof colors]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GPA Distribution */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">GPA Grade Distribution</h3>
            <div className="space-y-4">
              {Object.entries(gpaDistribution).map(([grade, count]) => {
                const percentage = (count / totalStudents) * 100;
                const color = grade.startsWith('A') ? 'bg-green-500' :
                             grade.startsWith('B') ? 'bg-blue-500' :
                             grade.startsWith('C') ? 'bg-yellow-500' : 'bg-red-500';
                
                return (
                  <div key={grade} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{grade}</span>
                      <span className="text-sm text-slate-600">{count} students ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Factors */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Factor Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Factor</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Average Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Impact Level</th>
                </tr>
              </thead>
              <tbody>
                {performanceFactors.map(({ factor, average, impact, color }) => (
                  <tr key={factor} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium text-slate-800">{factor}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {factor.includes('Level') 
                        ? `${average.toFixed(1)}/10`
                        : factor.includes('Hours')
                        ? `${average.toFixed(1)} hrs/week`
                        : `${average.toFixed(1)}%`
                      }
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                        {impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;