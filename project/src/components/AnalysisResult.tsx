import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Clock, FileText, Share2, AlertTriangle } from 'lucide-react';
import { AnalysisResult as AnalysisResultType } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onShare?: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onShare }) => {
  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getTrustIcon = (score: number) => {
    if (score >= 80) return ShieldCheck;
    if (score >= 60) return Shield;
    return ShieldAlert;
  };

  const TrustIcon = getTrustIcon(result.trustScore);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getTrustBg(result.trustScore)} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrustIcon className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Analysis Complete</h3>
              <p className="text-white/90">
                {result.isAuthentic ? 'Likely Authentic' : 'Potential Manipulation Detected'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{result.trustScore}%</div>
            <div className="text-white/90">Trust Score</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Explanation */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
          <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
        </div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-red-900">Warnings Detected</h5>
                <ul className="mt-1 space-y-1">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-red-800">• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Detection Methods */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Detection Methods</h4>
          <div className="space-y-3">
            {result.detectionMethods.map((method, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{method.name}</h5>
                  <span className={`text-sm font-semibold ${getTrustColor(method.score * 100)}`}>
                    {Math.round(method.score * 100)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{method.details}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getTrustBg(method.score * 100)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${method.score * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Technical Details</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Format:</span>
                <span className="ml-2 font-medium">{result.metadata.format}</span>
              </div>
              <div>
                <span className="text-gray-600">File Size:</span>
                <span className="ml-2 font-medium">
                  {(result.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              {result.metadata.resolution && (
                <div>
                  <span className="text-gray-600">Resolution:</span>
                  <span className="ml-2 font-medium">
                    {result.metadata.resolution.width}x{result.metadata.resolution.height}
                  </span>
                </div>
              )}
              {result.metadata.duration && (
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{result.metadata.duration}s</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Analyzed {result.analyzedAt.toLocaleTimeString()}</span>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};