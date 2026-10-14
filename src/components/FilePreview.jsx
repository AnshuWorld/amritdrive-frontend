import React, { useState, useEffect } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import apiClient from '../api/apiClient';

const FilePreview = ({ file, onBack }) => {
  const [objectUrl, setObjectUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setObjectUrl(null);
    setIsLoading(true);
    setError('');

    const fetchFile = async () => {
      try {
        const response = await apiClient.downloadFile(file.id);
        if (!response.ok) {
          throw new Error("File not found or access denied.");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
      } catch (err) {
        setError('Could not load file preview.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }
    if (!objectUrl) {
      return <p className="text-center">Loading preview...</p>;
    }
    if (file.mimetype.startsWith('image/')) {
      return <img src={objectUrl} alt={file.name} className="max-w-full max-h-full object-contain mx-auto" />;
    }
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('video/')) {
      return <iframe src={objectUrl} title={file.name} className="w-full h-full border-0" />;
    }
    return (
      <div className="text-center p-8 bg-gray-100 rounded-lg flex flex-col items-center justify-center h-full">
        <p className="font-semibold text-gray-700 text-lg">Preview not available for this file type.</p>
        <p className="text-sm text-gray-500 mb-6">{file.name}</p>
        <a href={objectUrl} download={file.name} className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium">
          <Download className="w-5 h-5" />
          <span>Download File</span>
        </a>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200 flex items-center">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mr-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <span className="font-semibold text-gray-800 truncate">{file.name}</span>
      </div>
      <div className="flex-grow p-4 flex items-center justify-center overflow-auto">
        {renderPreview()}
      </div>
    </div>
  );
};

export default FilePreview;