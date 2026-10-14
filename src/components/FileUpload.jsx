import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import apiClient from '../api/apiClient';

const FileUpload = ({ folderId, onUploadComplete, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0); // Reset progress for new upload

    try {
      // We are handling a single file upload for simplicity as in the original code.
      // To handle multiple files, you would loop through the `files` array.
      const file = files[0]; 
      
      // The original code didn't have a progress indicator for the actual upload,
      // so we'll simulate it. For real progress, you'd need XMLHttpRequest.
      setUploadProgress(50); // Simulate progress
      
      const result = await apiClient.uploadFile(file, folderId);
      
      setUploadProgress(100);
      onUploadComplete(result.storageInfo);
      
      setTimeout(() => {
        onClose();
      }, 500); // Close modal quicker on success

    } catch (error) {
      console.error('Upload failed:', error);
      // Here you could call a function to show an error toast
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
        handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Drag and drop a file here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              browse
            </button>
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
