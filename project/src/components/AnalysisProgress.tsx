import React from 'react';
import { Loader2, Brain, Search, Shield } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  isAnalyzing: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress, isAnalyzing }) => {
  if (!isAnalyzing) return null;

  const getStage = () => {
    if (progress < 25) return { icon: Search, text: 'Preprocessing media...' };
    if (progress < 50) return { icon: Brain, text: 'Running AI analysis...' };
    if (progress < 75) return { icon: Shield, text: 'Validating results...' };
    return { icon: Shield, text: 'Finalizing report...' };
  };

  const stage = getStage();
  const Icon = stage.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <Loader2 className="absolute inset-0 w-20 h-20 text-blue-600 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Analyzing Media
      </h3>
      <p className="text-gray-600 mb-6">{stage.text}</p>

      <div className="space-y-3">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{progress}% complete</p>
      </div>
    </div>
  );
};