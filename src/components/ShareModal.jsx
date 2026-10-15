import React, { useState } from 'react';
import { Copy, CheckCircle, Eye, Edit3, Shield, Calendar, Lock } from 'lucide-react';
import apiClient from '../api/apiClient';

const ShareModal = ({ file, onClose }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [permission, setPermission] = useState('viewer');
  const [expiresIn, setExpiresIn] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [createdPermission, setCreatedPermission] = useState('viewer');

  const handleCreateShare = async () => {
    setIsLoading(true);
    try {
      const fileId = file._id || file.id;
      const result = await apiClient.createShare(
        fileId,
        expiresIn ? parseInt(expiresIn, 10) : undefined,
        password || undefined,
        permission
      );
      
      const frontendOrigin = (import.meta.env.VITE_FRONTEND_URL && import.meta.env.VITE_FRONTEND_URL !== 'null')
        ? import.meta.env.VITE_FRONTEND_URL.replace(/\/+$/, '')
        : window.location.origin;
      const frontendUrl = `${frontendOrigin}/share/${result.token}`;
      setShareUrl(frontendUrl);
      setCreatedPermission(result.permission || permission);
    } catch (error) {
      console.error('Failed to create share:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy URL:', err);
    });
  };

  return (
    <div className="space-y-5 text-gray-800">
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
        <span className="text-gray-500">File:</span>
        <span className="font-semibold text-gray-900 truncate max-w-xs">{file.name}</span>
      </div>

      {!shareUrl ? (
        <>
          {/* Permission Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sharing Permission
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPermission('viewer')}
                className={`flex flex-col items-start p-3 border rounded-xl text-left transition-all ${
                  permission === 'viewer'
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${permission === 'viewer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-gray-900">Viewer</span>
                </div>
                <p className="text-xs text-gray-500">
                  Can view and download the file only.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPermission('editor')}
                className={`flex flex-col items-start p-3 border rounded-xl text-left transition-all ${
                  permission === 'editor'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${permission === 'editor' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-gray-900">Editor</span>
                </div>
                <p className="text-xs text-gray-500">
                  Can view, download, rename, and edit details.
                </p>
              </button>
            </div>
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              Expires in (days)
            </label>
            <input
              type="number"
              min="1"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              placeholder="Leave empty for no expiration"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-gray-400" />
              Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for public link"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleCreateShare}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isLoading ? 'Creating Share Link...' : 'Create Share Link'}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">Share link generated!</span>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              createdPermission === 'editor' 
                ? 'bg-emerald-200 text-emerald-800' 
                : 'bg-blue-200 text-blue-800'
            }`}>
              {createdPermission}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Public Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-xl bg-gray-50 focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-1.5 transition-colors"
              >
                {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-medium">{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            {createdPermission === 'editor' 
              ? '✨ Anyone with this link can view, download, and edit file details.'
              : '👀 Anyone with this link can view and download the file.'}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareModal;
