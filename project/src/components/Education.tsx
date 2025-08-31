import React from 'react';
import { Brain, Eye, AudioWaveform as Waveform, Database, Shield, AlertCircle } from 'lucide-react';

export const Education: React.FC = () => {
  const techniques = [
    {
      icon: Eye,
      title: 'Facial Landmark Analysis',
      description: 'AI examines the consistency of facial features, eye movements, and micro-expressions that are difficult for deepfake algorithms to replicate perfectly.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Waveform,
      title: 'Temporal Coherence Detection',
      description: 'Analyzes frame-to-frame consistency in videos, looking for unnatural transitions or artifacts that indicate digital manipulation.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Brain,
      title: 'Neural Network Signatures',
      description: 'Detects patterns specific to AI-generated content by analyzing the mathematical fingerprints left by generative models.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      title: 'Metadata Verification',
      description: 'Examines file metadata, compression artifacts, and digital signatures to identify signs of post-processing or manipulation.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const threats = [
    {
      title: 'Political Disinformation',
      description: 'Fake videos of politicians or public figures making false statements.',
      impact: 'High'
    },
    {
      title: 'Identity Theft',
      description: 'Unauthorized use of someone\'s likeness for fraudulent purposes.',
      impact: 'High'
    },
    {
      title: 'Financial Fraud',
      description: 'Voice cloning for phone scams and unauthorized transactions.',
      impact: 'Medium'
    },
    {
      title: 'Social Manipulation',
      description: 'Fake content designed to damage reputations or relationships.',
      impact: 'Medium'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Understanding Deepfake Detection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Deepfakes use artificial intelligence to create convincingly fake audio, video, and images. 
              Our Reality Verifier employs multiple AI detection methods to identify these manipulations 
              and protect against misinformation and fraud.
            </p>
          </div>
        </div>
      </div>

      {/* Detection Techniques */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">How AI Detects Deepfakes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techniques.map((technique, index) => {
            const Icon = technique.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-br ${technique.color} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{technique.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{technique.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Threat Landscape */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Why Deepfake Detection Matters</h3>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-gray-900">Common Deepfake Threats</h4>
            </div>
            
            <div className="space-y-4">
              {threats.map((threat, index) => (
                <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">{threat.title}</h5>
                    <p className="text-sm text-gray-600">{threat.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    threat.impact === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {threat.impact} Risk
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Best Practices for Media Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800">✓ Do:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Verify content from multiple sources</li>
              <li>• Check metadata and creation timestamps</li>
              <li>• Look for unnatural facial movements</li>
              <li>• Cross-reference with known authentic media</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-red-800">✗ Don't:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Share suspicious content without verification</li>
              <li>• Rely solely on visual inspection</li>
              <li>• Ignore contextual inconsistencies</li>
              <li>• Skip fact-checking from reputable sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};