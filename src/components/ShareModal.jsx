import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import apiClient from '../api/apiClient';

const ShareModal = ({ file, onClose }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateShare = async () => {
    setIsLoading(true);
    try {
      // --- THIS IS THE FIX ---
      // We need to use file._id (with an underscore) instead of file.id
      const result = await apiClient.createShare(
        file._id,
        expiresIn ? parseInt(expiresIn) : undefined,
        password || undefined
      );
      
      // Also, update the shareUrl to point to the frontend, not the backend API
      const frontendOrigin = process.env.NODE_ENV === 'production'
        ? (import.meta.env.VITE_FRONTEND_URL || window.location.origin)
        : window.location.origin;
      const frontendUrl = `${frontendOrigin.replace(/\/+$/, '')}/share/${result.token}`;
      setShareUrl(frontendUrl);
      
    } catch (error) {
      console.error('Failed to create share:', error);
      // You could add a toast notification here for the error
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
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Sharing: <span className="font-medium">{file.name}</span>
      </div>

      {!shareUrl ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expires in (days)
            </label>
            <input
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              placeholder="Leave empty for no expiration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for no password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleCreateShare}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Share Link'}
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareModal;

