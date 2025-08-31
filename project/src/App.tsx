import React, { useState } from 'react';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { MediaUpload } from './components/MediaUpload';
import { AnalysisProgress } from './components/AnalysisProgress';
import { AnalysisResult } from './components/AnalysisResult';
import { BatchAnalysis } from './components/BatchAnalysis';
import { Education } from './components/Education';
import { Dashboard } from './components/Dashboard';
import { ShareModal } from './components/ShareModal';
import { MediaPreview } from './components/MediaPreview';
import { useAuth } from './hooks/useAuth';
import { useAnalysis } from './hooks/useAnalysis';
import { MediaFile, AnalysisResult as AnalysisResultType } from './types';
import { BarChart3, Upload, BookOpen, Layers, Shield } from 'lucide-react';

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { analyzeMedia, analyzeBatch, isAnalyzing, progress } = useAnalysis();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'batch' | 'education' | 'dashboard'>('analyze');
  const [currentMedia, setCurrentMedia] = useState<MediaFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResultType[]>([]);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; result?: AnalysisResultType }>({
    isOpen: false
  });

  const handleMediaAdded = async (media: MediaFile[]) => {
    setCurrentMedia(media);
    
    if (media.length === 1) {
      const result = await analyzeMedia(media[0]);
      setAnalysisResults([result]);
    }
  };

  const handleBatchAnalysis = async (files: MediaFile[]) => {
    const results = await analyzeBatch(files);
    setAnalysisResults(results);
    return results;
  };

  const handleShare = (result: AnalysisResultType) => {
    setShareModal({ isOpen: true, result });
  };

  const tabs = [
    { id: 'analyze' as const, label: 'Analyze', icon: Upload },
    { id: 'batch' as const, label: 'Batch Process', icon: Layers },
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'education' as const, label: 'Learn', icon: BookOpen }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
            <Shield className="w-12 h-12 text-blue-600 animate-pulse mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Reality Verifier</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header
        user={user}
        onSignOut={signOut}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/80 backdrop-blur-md p-1 rounded-xl shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'analyze' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Media Analysis</h2>
                  <p className="text-gray-600 mb-6">
                    Upload or link to images, videos, or audio files to detect potential deepfakes and manipulation.
                  </p>
                  
                  <MediaUpload
                    onMediaAdded={handleMediaAdded}
                    acceptedTypes={['image/*', 'video/*', 'audio/*']}
                  />
                </div>

                {currentMedia.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Uploaded Media</h3>
                    {currentMedia.map(media => (
                      <MediaPreview key={media.id} media={media} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {isAnalyzing ? (
                  <AnalysisProgress progress={progress} isAnalyzing={isAnalyzing} />
                ) : analysisResults.length > 0 ? (
                  <div className="space-y-4">
                    {analysisResults.map(result => (
                      <AnalysisResult
                        key={result.id}
                        result={result}
                        onShare={() => handleShare(result)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/60 rounded-2xl shadow-lg p-8 text-center">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to Analyze
                    </h3>
                    <p className="text-gray-600">
                      Upload media files to begin AI-powered deepfake detection and authenticity verification.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'batch' && (
            <BatchAnalysis
              onAnalyzeBatch={handleBatchAnalysis}
              isAnalyzing={isAnalyzing}
              progress={progress}
            />
          )}

          {activeTab === 'dashboard' && user && (
            <Dashboard recentAnalyses={analysisResults} />
          )}

          {activeTab === 'education' && <Education />}

          {activeTab === 'dashboard' && !user && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-12 text-center">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Access</h3>
              <p className="text-gray-600 mb-8">
                Sign in to access your personal dashboard with analysis history and insights.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                Sign In to Continue
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        loading={authLoading}
      />

      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false })}
        result={shareModal.result!}
      />
    </div>
  );
}

export default App;