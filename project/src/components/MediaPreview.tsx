import React from 'react';
import { FileImage, FileVideo, FileAudio, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { MediaFile } from '../types';

interface MediaPreviewProps {
  media: MediaFile;
  showMetadata?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ media, showMetadata = true }) => {
  const getIcon = () => {
    switch (media.type) {
      case 'image': return FileImage;
      case 'video': return FileVideo;
      case 'audio': return FileAudio;
      default: return FileImage;
    }
  };

  const getTypeColor = () => {
    switch (media.type) {
      case 'image': return 'from-blue-500 to-cyan-500';
      case 'video': return 'from-purple-500 to-pink-500';
      case 'audio': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`p-3 bg-gradient-to-br ${getTypeColor()} rounded-xl flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900 truncate">{media.name}</h4>
            {media.url && (
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </div>
          
          {showMetadata && (
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-3 h-3" />
                <span>{media.type.toUpperCase()}</span>
                {media.size > 0 && (
                  <span>• {(media.size / 1024 / 1024).toFixed(2)} MB</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>Uploaded {media.uploadedAt.toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};