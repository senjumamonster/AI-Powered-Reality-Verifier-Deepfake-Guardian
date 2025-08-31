import React, { useState } from 'react';
import { X, Link, Mail, MessageSquare, Download, Copy, Check } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, result }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const shareUrl = `https://realityverifier.app/analysis/${result.id}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = `Media Analysis Results - Trust Score: ${result.trustScore}%`;
    const body = `I've analyzed a media file using Reality Verifier. Here are the results:\n\nTrust Score: ${result.trustScore}%\nStatus: ${result.isAuthentic ? 'Likely Authentic' : 'Potential Manipulation Detected'}\n\nView full report: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareViaSocial = (platform: string) => {
    const text = `Media analysis complete: ${result.trustScore}% trust score. ${result.isAuthentic ? 'Authentic content verified' : 'Potential deepfake detected'} 🛡️`;
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) window.open(url, '_blank');
  };

  const downloadReport = () => {
    const reportData = {
      analysisId: result.id,
      trustScore: result.trustScore,
      isAuthentic: result.isAuthentic,
      confidence: result.confidence,
      explanation: result.explanation,
      warnings: result.warnings,
      detectionMethods: result.detectionMethods,
      metadata: result.metadata,
      analyzedAt: result.analyzedAt
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Share Analysis</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Score Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Trust Score</span>
              <span className={`font-bold text-lg ${
                result.trustScore >= 80 ? 'text-green-600' :
                result.trustScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {result.trustScore}%
              </span>
            </div>
            <p className="text-sm text-gray-700">
              {result.isAuthentic ? 'Likely Authentic' : 'Potential Manipulation Detected'}
            </p>
          </div>

          {/* Share URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <button
              onClick={shareViaEmail}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Share via Email</span>
            </button>

            <button
              onClick={() => shareViaSocial('twitter')}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Share on Twitter</span>
            </button>

            <button
              onClick={downloadReport}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download Full Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};