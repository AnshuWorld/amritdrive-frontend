import React from 'react';
import { File, Calendar, Share2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const SharedLinksView = ({ sharedLinks, onRevokeShare }) => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Shared Links</h2>
      {sharedLinks.length === 0 ? (
        <div className="text-center py-12 h-full flex flex-col justify-center items-center">
          <Share2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active shared links</h3>
          <p className="text-gray-600">Right-click a file and select "Share" to create a link.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sharedLinks.map((share) => (
            <div key={share._id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <File className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{share.file ? share.file.name : 'Deleted File'}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <span>Shared: {formatDate(share.createdAt)}</span>
                    {share.expiresAt && (
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Expires: {formatDate(share.expiresAt)}</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => onRevokeShare(share._id)} className="text-red-600 hover:text-red-700 px-3 py-1 text-sm rounded-md hover:bg-red-50 font-medium">
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedLinksView;