export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  size: number;
  file?: File;
  url?: string;
  uploadedAt: Date;
}

export interface AnalysisResult {
  id: string;
  mediaId: string;
  trustScore: number;
  isAuthentic: boolean;
  confidence: number;
  detectionMethods: DetectionMethod[];
  metadata: MediaMetadata;
  explanation: string;
  warnings: string[];
  analyzedAt: Date;
}

export interface DetectionMethod {
  name: string;
  type: 'visual' | 'audio' | 'metadata' | 'temporal';
  score: number;
  confidence: number;
  details: string;
}

export interface MediaMetadata {
  resolution?: { width: number; height: number };
  duration?: number;
  format: string;
  fileSize: number;
  createdAt?: Date;
  camera?: string;
  location?: string;
  compressionArtifacts: boolean;
  digitalSignature?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  plan: 'free' | 'pro';
}

export interface BatchAnalysis {
  id: string;
  files: MediaFile[];
  results: AnalysisResult[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  completedAt?: Date;
}