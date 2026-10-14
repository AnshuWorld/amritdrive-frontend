import React from 'react';
import { Folder, File } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

const FileExplorer = ({ folders, files, breadcrumbs, onNavigateToBreadcrumb, onNavigateToFolder, onFileClick, onContextMenu }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <nav className="flex items-center space-x-2">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => onNavigateToBreadcrumb(index)}
                disabled={index === breadcrumbs.length - 1}
                className={`text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-gray-900 cursor-default' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {item.name}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {folders.length === 0 && files.length === 0 ? (
          <div className="text-center py-12 h-full flex flex-col justify-center items-center">
            <Folder className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">This folder is empty</h3>
            <p className="text-gray-600">Get started by uploading a file or creating a new folder.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <div key={folder._id} onDoubleClick={() => onNavigateToFolder(folder._id, folder.name)} onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, { id: folder._id, name: folder.name, type: 'folder' }); }} className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all flex flex-col items-center text-center">
                <Folder className="w-12 h-12 text-blue-500 mb-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 break-words w-full">{folder.name}</span>
              </div>
            ))}
            {files.map((file) => (
              <div key={file._id} onClick={() => onFileClick(file)} onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, { id: file._id, name: file.name, type: 'file' }); }} className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all flex flex-col items-center text-center">
                <File className="w-12 h-12 text-gray-400 mb-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 break-words w-full">{file.name}</span>
                <span className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;