import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Play } from 'lucide-react';
import { MediaFile, AnalysisResult } from '../types';

interface BatchAnalysisProps {
  onAnalyzeBatch: (files: MediaFile[]) => Promise<AnalysisResult[]>;
  isAnalyzing: boolean;
  progress: number;
}

export const BatchAnalysis: React.FC<BatchAnalysisProps> = ({
  onAnalyzeBatch,
  isAnalyzing,
  progress
}) => {
  const [batchFiles, setBatchFiles] = useState<MediaFile[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mediaFiles = files.map(file => ({
      id: 'batch-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' as const : 
            file.type.startsWith('video/') ? 'video' as const : 'audio' as const,
      size: file.size,
      file,
      uploadedAt: new Date()
    }));
    setBatchFiles([...batchFiles, ...mediaFiles]);
  };

  const removeFile = (id: string) => {
    setBatchFiles(files => files.filter(f => f.id !== id));
  };

  const startBatchAnalysis = async () => {
    if (batchFiles.length === 0) return;
    
    const batchResults = await onAnalyzeBatch(batchFiles);
    setResults(batchResults);
  };

  const clearAll = () => {
    setBatchFiles([]);
    setResults([]);
  };

  const exportResults = () => {
    const csvContent = [
      'File Name,Trust Score,Authentic,Confidence,Warnings',
      ...results.map(r => {
        const file = batchFiles.find(f => f.id === r.mediaId);
        return `"${file?.name}",${r.trustScore},${r.isAuthentic},${r.confidence},"${r.warnings.join('; ')}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deepfake-analysis-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Batch Analysis</h3>
        <p className="text-gray-600 mb-6">
          Upload multiple files to analyze them all at once. Perfect for researchers and content moderators.
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Click to add files to batch</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {/* File List */}
        {batchFiles.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">
                Files in Queue ({batchFiles.length})
              </h4>
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="max-h-40 overflow-y-auto space-y-2">
              {batchFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.type.toUpperCase()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Controls */}
        <div className="flex space-x-3">
          <button
            onClick={startBatchAnalysis}
            disabled={batchFiles.length === 0 || isAnalyzing}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            <span>{isAnalyzing ? `Analyzing... ${progress}%` : 'Start Batch Analysis'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Batch Results</h3>
            <button
              onClick={exportResults}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">File</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trust Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Warnings</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => {
                  const file = batchFiles.find(f => f.id === result.mediaId);
                  return (
                    <tr key={result.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{file?.name}</div>
                        <div className="text-sm text-gray-500">{file?.type.toUpperCase()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-bold ${getTrustColor(result.trustScore)}`}>
                          {result.trustScore}%
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.isAuthentic 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.isAuthentic ? 'Authentic' : 'Suspicious'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {result.warnings.length > 0 ? `${result.warnings.length} warnings` : 'None'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};