import React from 'react';
import { PredictionResult } from '../types';

interface PerformanceChartProps {
  predictions: PredictionResult[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500">
        No data available for visualization
      </div>
    );
  }

  // Group predictions by GPA ranges
  const gpaRanges = [
    { range: '0.0-1.0', min: 0, max: 1, count: 0, color: 'bg-red-500' },
    { range: '1.0-2.0', min: 1, max: 2, count: 0, color: 'bg-orange-500' },
    { range: '2.0-3.0', min: 2, max: 3, count: 0, color: 'bg-yellow-500' },
    { range: '3.0-4.0', min: 3, max: 4, count: 0, color: 'bg-green-500' },
  ];

  predictions.forEach(prediction => {
    const gpa = prediction.predictedGPA;
    const range = gpaRanges.find(r => gpa >= r.min && gpa < r.max);
    if (range) range.count++;
  });

  const maxCount = Math.max(...gpaRanges.map(r => r.count));

  return (
    <div className="space-y-4">
      {gpaRanges.map(({ range, count, color }) => {
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return (
          <div key={range} className="flex items-center space-x-3">
            <div className="w-16 text-sm font-medium text-slate-700">
              {range}
            </div>
            <div className="flex-1 bg-slate-200 rounded-full h-4 relative">
              <div 
                className={`h-4 rounded-full ${color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
              {count > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {count}
                </span>
              )}
            </div>
            <div className="w-8 text-sm text-slate-600 text-right">
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceChart;