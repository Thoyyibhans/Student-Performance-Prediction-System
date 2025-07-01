import React from 'react';
import { Users, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { PredictionResult } from '../types';
import RecentPredictions from './RecentPredictions';
import PerformanceChart from './PerformanceChart';

interface DashboardProps {
  predictions: PredictionResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ predictions }) => {
  const totalPredictions = predictions.length;
  const highRiskCount = predictions.filter(p => p.riskLevel === 'high').length;
  const averageGPA = predictions.length > 0 
    ? predictions.reduce((sum, p) => sum + p.predictedGPA, 0) / predictions.length 
    : 0;
  const averageConfidence = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
    : 0;

  const stats = [
    {
      label: 'Total Predictions',
      value: totalPredictions.toString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'High Risk Students',
      value: highRiskCount.toString(),
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      label: 'Average Predicted GPA',
      value: averageGPA.toFixed(2),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      label: 'Model Confidence',
      value: `${(averageConfidence * 100).toFixed(0)}%`,
      icon: Target,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Performance Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`p-6 rounded-lg border ${color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-60" />
              </div>
            </div>
          ))}
        </div>

        {predictions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Performance Distribution
              </h3>
              <PerformanceChart predictions={predictions} />
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Risk Level Distribution
              </h3>
              <div className="space-y-3">
                {['low', 'medium', 'high'].map(risk => {
                  const count = predictions.filter(p => p.riskLevel === risk).length;
                  const percentage = predictions.length > 0 ? (count / predictions.length) * 100 : 0;
                  const colors = {
                    low: 'bg-green-500',
                    medium: 'bg-yellow-500',
                    high: 'bg-red-500'
                  };
                  
                  return (
                    <div key={risk} className="flex items-center space-x-3">
                      <div className="w-20 text-sm font-medium capitalize">{risk} Risk</div>
                      <div className="flex-1 bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${colors[risk as keyof typeof colors]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-slate-600 text-right">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {predictions.length > 0 && (
        <RecentPredictions predictions={predictions.slice(0, 10)} />
      )}
    </div>
  );
};

export default Dashboard;