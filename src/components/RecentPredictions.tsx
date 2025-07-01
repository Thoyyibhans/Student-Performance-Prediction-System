import React from 'react';
import { Clock, User, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { PredictionResult } from '../types';

interface RecentPredictionsProps {
  predictions: PredictionResult[];
}

const RecentPredictions: React.FC<RecentPredictionsProps> = ({ predictions }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800">Recent Predictions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Student</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Predicted GPA</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Final Exam</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Level</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Confidence</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {prediction.student.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-lg font-semibold text-blue-600">
                    {prediction.predictedGPA.toFixed(2)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-lg font-semibold text-green-600">
                    {prediction.predictedFinalExam.toFixed(0)}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.riskLevel)}`}>
                    {getRiskIcon(prediction.riskLevel)}
                    <span className="capitalize">{prediction.riskLevel}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-600">
                    {(prediction.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-600">
                  {prediction.timestamp.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {predictions.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No predictions yet. Start by making your first prediction!</p>
        </div>
      )}
    </div>
  );
};

export default RecentPredictions;