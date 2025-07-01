import React, { useState } from 'react';
import { User, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { StudentData, PredictionResult } from '../types';
import { predictPerformance } from '../utils/mlModel';

interface PredictionFormProps {
  onPrediction: (result: PredictionResult) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPrediction }) => {
  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    attendanceRate: 85,
    quizAverage: 75,
    assignmentAverage: 80,
    finalProjectScore: 85,
    participationLevel: 7,
    studyHours: 15,
    previousGPA: 3.0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (field: keyof StudentData, value: string | number) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const prediction = predictPerformance(studentData);
    setResult(prediction);
    onPrediction(prediction);
    setIsSubmitting(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <TrendingUp className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-800">Student Performance Prediction</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Student Name
              </label>
              <input
                type="text"
                required
                value={studentData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Attendance Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.attendanceRate}
                  onChange={(e) => handleInputChange('attendanceRate', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quiz Average (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.quizAverage}
                  onChange={(e) => handleInputChange('quizAverage', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assignment Average (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.assignmentAverage}
                  onChange={(e) => handleInputChange('assignmentAverage', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Final Project Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={studentData.finalProjectScore}
                  onChange={(e) => handleInputChange('finalProjectScore', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Participation Level (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={studentData.participationLevel}
                  onChange={(e) => handleInputChange('participationLevel', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Study Hours/Week
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={studentData.studyHours}
                  onChange={(e) => handleInputChange('studyHours', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Previous GPA (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={studentData.previousGPA || ''}
                onChange={(e) => handleInputChange('previousGPA', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3.5"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !studentData.name}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Analyzing...' : 'Predict Performance'}
            </button>
          </form>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Prediction Results for {result.student.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.predictedGPA.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600">Predicted GPA</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">
                        {result.predictedFinalExam.toFixed(0)}%
                      </div>
                      <div className="text-sm text-slate-600">Final Exam Score</div>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-2 p-3 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                    {getRiskIcon(result.riskLevel)}
                    <span className="font-medium capitalize">{result.riskLevel} Risk Level</span>
                    <span className="text-sm">({(result.confidence * 100).toFixed(0)}% confidence)</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-slate-50 rounded-lg p-8 text-center">
                <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  Enter student information and click "Predict Performance" to see AI-powered predictions and recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;