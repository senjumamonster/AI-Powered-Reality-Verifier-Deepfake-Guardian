import React, { useState } from 'react';
import { BarChart3, Clock, Shield, TrendingUp, FileText } from 'lucide-react';
import { AnalysisResult } from '../types';

interface DashboardProps {
  recentAnalyses: AnalysisResult[];
}

export const Dashboard: React.FC<DashboardProps> = ({ recentAnalyses }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const stats = {
    totalAnalyses: recentAnalyses.length,
    authenticMedia: recentAnalyses.filter(r => r.isAuthentic).length,
    suspiciousMedia: recentAnalyses.filter(r => !r.isAuthentic).length,
    avgTrustScore: Math.round(
      recentAnalyses.reduce((sum, r) => sum + r.trustScore, 0) / (recentAnalyses.length || 1)
    )
  };

  const authenticity_rate = Math.round((stats.authenticMedia / (stats.totalAnalyses || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Authentic Media</p>
              <p className="text-2xl font-bold text-green-600">{stats.authenticMedia}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspicious Media</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspiciousMedia}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Trust Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgTrustScore}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Analyses</h3>
          <div className="flex space-x-2">
            {(['day', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {recentAnalyses.length > 0 ? (
          <div className="space-y-3">
            {recentAnalyses.slice(0, 5).map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    analysis.isAuthentic ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Media Analysis</p>
                    <p className="text-sm text-gray-500">
                      {analysis.analyzedAt.toLocaleDateString()} at {analysis.analyzedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    analysis.trustScore >= 80 ? 'text-green-600' :
                    analysis.trustScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {analysis.trustScore}%
                  </p>
                  <p className="text-xs text-gray-500">Trust Score</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No analyses yet</p>
            <p className="text-sm text-gray-400">Upload some media to get started</p>
          </div>
        )}
      </div>

      {/* Security Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Security Insights</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Authenticity Rate</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Authentic Content</span>
                <span>{authenticity_rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${authenticity_rate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Detection Accuracy</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Model Confidence</span>
                <span>94.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full w-[94.2%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};