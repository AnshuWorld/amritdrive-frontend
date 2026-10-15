import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { File, Download, HardDrive, Eye, EyeOff, Edit3, CheckCircle, Save, X } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

const PublicSharePage = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [permission, setPermission] = useState('viewer');
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Editor mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
        setPermission(data.permission || 'viewer');
        setOwnerInfo(data.owner);
        setRequiresPassword(data.requiresPassword);
        setEditName(data.file.name || '');
        setEditDescription(data.file.description || '');
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
    setSuccessMessage('');
    try {
      const response = await apiClient.downloadSharedFile(token, password);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Download failed.');
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError('File name cannot be empty.');
      return;
    }
    if (requiresPassword && !password) {
      setError('Please enter the password below to verify your editor access.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      const result = await apiClient.editSharedFile(
        token,
        { name: editName.trim(), description: editDescription.trim() },
        password
      );
      setFileInfo((prev) => ({
        ...prev,
        name: result.file.name,
        description: result.file.description,
        updatedAt: result.file.updatedAt
      }));
      setSuccessMessage('File updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update file.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isEditor = permission === 'editor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 text-center border border-gray-100">
        
        {/* Header Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 mb-4">
          <HardDrive className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Amrit Drive Share</h1>
        {ownerInfo?.name && (
          <p className="text-xs text-gray-500 mb-3">Shared by <span className="font-medium text-gray-700">{ownerInfo.name}</span></p>
        )}

        {/* Permission Pill */}
        <div className="flex justify-center mb-5">
          {isEditor ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <Edit3 className="w-3.5 h-3.5" />
              Editor Permission Granted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              Viewer Permission (Read Only)
            </span>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 my-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-left">
            <span className="font-semibold block">Notice:</span>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 my-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm text-left flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {fileInfo && (
          <div className="space-y-5">
            {/* File Info Box */}
            <div className="p-5 border border-gray-200 rounded-2xl bg-gray-50/70 flex flex-col items-center space-y-2 relative">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <File className="w-10 h-10 text-blue-600" />
              </div>

              {!isEditing ? (
                <>
                  <p className="text-lg font-bold text-gray-800 break-all">{fileInfo.name}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{formatFileSize(fileInfo.size)}</span>
                    {fileInfo.mimetype && <span>• {fileInfo.mimetype}</span>}
                  </div>
                  {fileInfo.description && (
                    <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200/60 w-full text-left mt-2">
                      <span className="font-semibold text-gray-700">Description:</span> {fileInfo.description}
                    </p>
                  )}

                  {/* Editor action toggle button */}
                  {isEditor && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit File Details
                    </button>
                  )}
                </>
              ) : (
                /* Inline Editor Form for Editors */
                <form onSubmit={handleSaveEdit} className="w-full text-left space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Download Form */}
            <form onSubmit={handleDownload}>
              {requiresPassword && (
                <div className="text-left mb-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password Required
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password to access"
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
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
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

            <p className="text-xs text-gray-400">
              {isEditor 
                ? 'As an Editor, you can download the file and edit its details.'
                : 'As a Viewer, you can preview and download this file.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSharePage;