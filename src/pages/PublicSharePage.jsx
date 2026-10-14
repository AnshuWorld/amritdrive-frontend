import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { File, Download, HardDrive, Eye, EyeOff } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

const PublicSharePage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchFileInfo = async () => {
      if (!token) {
        setError('No share token provided.');
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiClient.getShareInfo(token);
        setFileInfo(data.file);
        setRequiresPassword(data.requiresPassword);
      } catch (err) {
        setError(err.message || 'The share link is invalid or has expired.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFileInfo();
  }, [token]);

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);
    setError('');
    try {
      const response = await apiClient.downloadSharedFile(token, password);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Download failed.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <HardDrive className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">File-Store Share</h1>

        {error && (
          <div className="p-4 my-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {fileInfo && (
          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-gray-50 flex flex-col items-center space-y-3">
              <File className="w-16 h-16 text-gray-400" />
              <p className="text-xl font-semibold text-gray-800 break-all">{fileInfo.name}</p>
              <p className="text-gray-500">{formatFileSize(fileInfo.size)}</p>
            </div>
            <form onSubmit={handleDownload}>
              {requiresPassword && (
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Required
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password to download"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={isDownloading}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50"
              >
                {isDownloading ? (
                   <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Downloading...</span>
                   </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download File</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSharePage;