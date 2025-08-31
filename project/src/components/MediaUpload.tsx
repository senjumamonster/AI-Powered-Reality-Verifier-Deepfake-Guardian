import React, { useState, useCallback } from 'react';
import { Upload, Link, FileImage, FileVideo, FileAudio, X } from 'lucide-react';
import { MediaFile } from '../types';

interface MediaUploadProps {
  onMediaAdded: (media: MediaFile[]) => void;
  acceptedTypes: string[];
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaAdded, acceptedTypes }) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const getMediaType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // fallback
  };

  const createMediaFile = (file: File): MediaFile => ({
    id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: getMediaType(file),
    size: file.size,
    file,
    uploadedAt: new Date()
  });

  const createMediaFromUrl = (url: string): MediaFile => {
    const type = url.includes('video') ? 'video' : url.includes('audio') ? 'audio' : 'image';
    return {
      id: 'media-url-' + Date.now(),
      name: url.split('/').pop() || 'media-file',
      type,
      size: 0,
      url,
      uploadedAt: new Date()
    };
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const mediaFiles = files.map(createMediaFile);
      onMediaAdded(mediaFiles);
    }
  }, [onMediaAdded]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const mediaFiles = files.map(createMediaFile);
      onMediaAdded(mediaFiles);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const mediaFile = createMediaFromUrl(urlInput.trim());
      onMediaAdded([mediaFile]);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="w-8 h-8" />;
      case 'video': return <FileVideo className="w-8 h-8" />;
      case 'audio': return <FileAudio className="w-8 h-8" />;
      default: return <Upload className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white">
              <Upload className="w-8 h-8" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Media Files
            </h3>
            <p className="text-gray-600 mt-1">
              Drag and drop your files here, or click to browse
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FileImage className="w-4 h-4" />
              <span>Images</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileVideo className="w-4 h-4" />
              <span>Videos</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileAudio className="w-4 h-4" />
              <span>Audio</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">or</span>
          </div>
        </div>
      </div>

      {showUrlInput ? (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste media URL here..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze
            </button>
            <button
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
              }}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowUrlInput(true)}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <Link className="w-5 h-5 inline mr-2" />
          Analyze Media from URL
        </button>
      )}
    </div>
  );
};