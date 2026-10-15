import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Folder, File, Download, HardDrive, Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import { formatFileSize, formatDate } from '../utils/helpers';

const PublicFolderPage = () => {
  const { token } = useParams();
  const [folderData, setFolderData] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchFolderData = async () => {
      if (!token) {
        setError('No share token provided.');
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiClient.getPublicFolder(token);
        setFolderData(data.folder);
        setFiles(data.files || []);
      } catch (err) {
        setError(err.message || 'This folder link is invalid or has been revoked.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolderData();
  }, [token]);

  const handleDownloadFile = async (file) => {
    setDownloadingId(file._id);
    try {
      const response = await apiClient.downloadPublicFolderFile(token, file._id);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Download failed.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName || file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading public folder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center border border-gray-100">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Folder Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to AmritDrive</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AmritDrive</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Globe className="w-3 h-3" />
              <span>Public Folder</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Folder Header Card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Folder className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{folderData?.name}</h1>
              <p className="text-sm text-gray-500">
                Shared by <span className="font-medium text-gray-700">{folderData?.owner}</span>
                {folderData?.createdAt && ` • ${formatDate(folderData.createdAt)}`}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <span className="font-semibold text-gray-900">{files.length}</span> {files.length === 1 ? 'file' : 'files'} shared
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Folder Contents</h2>
          </div>

          {files.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">This folder is empty</h3>
              <p className="text-sm text-gray-500">The owner hasn't uploaded any files to this folder yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-4">
                    <File className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                        {file.createdAt && ` • ${formatDate(file.createdAt)}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadFile(file)}
                    disabled={downloadingId === file._id}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === file._id ? 'Downloading...' : 'Download'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicFolderPage;
