import React from 'react';
import { Folder, File, RotateCcw, X, Trash2 } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

const TrashView = ({ trashItems, onRestore, onPermanentDelete, onEmptyTrash }) => {
  const allItems = [...(trashItems.folders || []), ...(trashItems.files || [])];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Trash</h2>
        <button onClick={onEmptyTrash} disabled={allItems.length === 0} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
          Empty Trash
        </button>
      </div>
      {allItems.length === 0 ? (
        <div className="text-center py-12 h-full flex flex-col justify-center items-center">
          <Trash2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is empty</h3>
          <p className="text-gray-600">Items you move to trash will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                {item.size === undefined ? <Folder className="w-6 h-6 text-gray-400" /> : <File className="w-6 h-6 text-gray-400" />}
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.size === undefined ? 'Folder' : `File • ${formatFileSize(item.size)}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => onRestore(item.size === undefined ? 'folder' : 'file', item._id, item.name)} className="text-blue-600 hover:text-blue-700 p-2" title="Restore">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => onPermanentDelete(item.size === undefined ? 'folder' : 'file', item._id, item.name)} className="text-red-600 hover:text-red-700 p-2" title="Delete permanently">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashView;