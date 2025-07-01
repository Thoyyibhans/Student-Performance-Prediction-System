import React from 'react';
import { GraduationCap, Brain, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Student Performance Prediction System
              </h1>
              <p className="text-slate-600 text-sm">
                AI-powered academic performance analysis and risk assessment
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-600">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-medium">ML Model v2.1</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">95.2% Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;