import React from 'react';
import { Upload, FolderPlus, Folder, Trash2, Share2 } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

const Sidebar = ({ currentView, onViewChange, onUploadClick, onNewFolderClick, storageInfo }) => {
  const navItems = [
    { id: 'explorer', label: 'My Files', icon: Folder },
    { id: 'trash', label: 'Trash', icon: Trash2 },
    { id: 'sharedLinks', label: 'Shared Links', icon: Share2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto p-6 flex flex-col">
      <div className="space-y-4">
        <div className="space-y-2">
          <button onClick={onUploadClick} className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Upload className="w-5 h-5" />
            <span>Upload File</span>
          </button>
          <button onClick={onNewFolderClick} className="w-full flex items-center justify-center space-x-3 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <FolderPlus className="w-5 h-5" />
            <span>New Folder</span>
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${currentView === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-sm font-semibold text-gray-700 mb-2">Storage</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-800">{formatFileSize(storageInfo.storageUsed)}</span>
            <span className="text-gray-500">of {formatFileSize(storageInfo.storageLimit)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((storageInfo.storageUsed / storageInfo.storageLimit) * 100, 100)}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;