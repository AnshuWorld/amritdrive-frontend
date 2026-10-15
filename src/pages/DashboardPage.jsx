import React, { useState } from 'react';
import { Download, Edit2 as EditIcon, Share2, Trash2, Globe, Lock, Copy } from 'lucide-react';

// API and Helpers
import apiClient from '../api/apiClient';
import { useFileManager } from '../hooks/useFileManager';

// Modals and UI Components
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import ContextMenu from '../components/ContextMenu';
import FileUpload from '../components/FileUpload';
import ShareModal from '../components/ShareModal';
import FilePreview from '../components/FilePreview';

// Dashboard Layout Components
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import FileExplorer from '../components/dashboard/FileExplorer';
import TrashView from '../components/dashboard/TrashView';
import SharedLinksView from '../components/dashboard/SharedLinksView';

const DashboardPage = ({ user, onLogout }) => {
  // UI State Management
  const [currentView, setCurrentView] = useState('explorer'); // 'explorer', 'trash', 'sharedLinks'
  const [viewingFile, setViewingFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(null);
  const [showShareModal, setShowShareModal] = useState(null);
  const [showFolderShareModal, setShowFolderShareModal] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Custom hook for all file management logic
  const {
    currentFolderId, folders, files, trashItems, sharedLinks, storageInfo,
    breadcrumbs, searchQuery, setSearchQuery, navigateToFolder, navigateToBreadcrumb,
    refreshData
  } = useFileManager(currentView);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Event Handlers
  const handleLogout = async () => {
    try { 
      await apiClient.logout(); 
    } catch { 
      console.error("Logout failed on server but proceeding on client."); 
    }
    onLogout();
  };

  const handleCreateFolder = async (name) => {
    try {
      await apiClient.createFolder(name, currentFolderId);
      showToast('Folder created successfully');
      refreshData();
      setShowNewFolderModal(false);
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleRename = async () => {
    if (!showRenameModal) return;
    try {
      const { type, id } = showRenameModal;
      if (type === 'file') {
        await apiClient.renameFile(id, renameValue);
      } else {
        await apiClient.updateFolder(id, renameValue);
      }
      showToast('Renamed successfully');
      refreshData();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setShowRenameModal(null);
      setRenameValue('');
    }
  };
  
  const handleDownload = async (file) => {
    try {
      const fileId = file._id || file.id;
      const response = await apiClient.downloadFile(fileId);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    }
  };

  const handleMoveToTrash = async (type, id, name) => {
    try {
      await apiClient.moveToTrash(type, id);
      showToast(`${name} moved to trash`);
      refreshData();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleToggleFolderVisibility = async (folderId, isPublic) => {
    try {
      const data = await apiClient.toggleFolderVisibility(folderId, isPublic);
      const updatedFolder = data.folder;
      if (updatedFolder?.isPublic) {
        setShowFolderShareModal(updatedFolder);
        showToast('Folder is now public! Share link created.');
      } else {
        showToast('Folder permission set to Private.');
      }
      refreshData();
    } catch (error) {
      showToast(error.message || 'Failed to update folder permission', 'error');
    }
  };

  const handleCopyFolderLink = (shareToken) => {
    const url = `${window.location.origin}/share/folder/${shareToken}`;
    navigator.clipboard.writeText(url)
      .then(() => showToast('Public folder link copied to clipboard!'))
      .catch(() => showToast('Public link: ' + url));
  };

  const handleRestoreFromTrash = async (type, id, name) => {
    try {
      await apiClient.restoreFromTrash(type, id);
      showToast(`${name} restored successfully`);
      refreshData();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handlePermanentDelete = async (type, id, name) => {
    if (!window.confirm(`Permanently delete "${name}"? This action cannot be undone.`)) return;
    try {
      await apiClient.permanentDelete(type, id);
      showToast(`${name} deleted permanently`);
      refreshData();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm('Are you sure you want to empty the trash? This action cannot be undone.')) return;
    try {
      await apiClient.emptyTrash();
      showToast('Trash emptied successfully');
      refreshData();
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleRevokeShare = async (shareId) => {
    try {
      await apiClient.deleteShare(shareId);
      showToast('Share link revoked');
      refreshData();
    } catch (error) { showToast(error.message, 'error'); }
  };
  
  const handleContextMenu = (event, item) => {
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };
  
  const handleViewChange = (view) => {
    setCurrentView(view);
    setViewingFile(null); // Reset file preview when changing views
  };

  const renderCurrentView = () => {
    if (viewingFile && currentView === 'explorer') {
      return <FilePreview file={viewingFile} onBack={() => setViewingFile(null)} />;
    }

    switch (currentView) {
      case 'trash':
        return <TrashView trashItems={trashItems} onRestore={handleRestoreFromTrash} onPermanentDelete={handlePermanentDelete} onEmptyTrash={handleEmptyTrash} />;
      case 'sharedLinks':
        return <SharedLinksView sharedLinks={sharedLinks} onRevokeShare={handleRevokeShare} />;
      case 'explorer':
      default:
        return <FileExplorer folders={folders} files={files} breadcrumbs={breadcrumbs} onNavigateToBreadcrumb={navigateToBreadcrumb} onNavigateToFolder={navigateToFolder} onFileClick={setViewingFile} onContextMenu={handleContextMenu} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        currentView={currentView}
        viewingFile={viewingFile}
      />

      <div className="flex" style={{ height: 'calc(100vh - 81px)' }}>
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          onUploadClick={() => setShowUploadModal(true)}
          onNewFolderClick={() => setShowNewFolderModal(true)}
          storageInfo={storageInfo}
        />

        <main className="flex-1 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* --- Modals and Context Menu --- */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)}>
            {/* FILE ONLY: Download */}
            {contextMenu.item.type === 'file' && (
                <button onClick={() => { const file = files.find(f => (f._id || f.id) === contextMenu.item.id); if (file) handleDownload(file); setContextMenu(null); }} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>Download</span>
                </button>
            )}

            {/* FOLDER & FILE: Rename */}
            <button onClick={() => { setShowRenameModal({ id: contextMenu.item.id, name: contextMenu.item.name, type: contextMenu.item.type }); setRenameValue(contextMenu.item.name); setContextMenu(null); }} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              <EditIcon className="w-4 h-4 text-gray-500" />
              <span>Rename</span>
            </button>

            {/* FOLDER ONLY: Make Public / Make Private Permission */}
            {contextMenu.item.type === 'folder' && (
              <>
                {contextMenu.item.isPublic ? (
                  <>
                    <button
                      onClick={() => {
                        handleCopyFolderLink(contextMenu.item.shareToken);
                        setContextMenu(null);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full text-left"
                    >
                      <Copy className="w-4 h-4 text-blue-500" />
                      <span>Copy Public Link</span>
                    </button>
                    <button
                      onClick={() => {
                        handleToggleFolderVisibility(contextMenu.item.id, false);
                        setContextMenu(null);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 w-full text-left"
                    >
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>Make Private</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleToggleFolderVisibility(contextMenu.item.id, true);
                      setContextMenu(null);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 w-full text-left"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Make Public</span>
                  </button>
                )}
              </>
            )}

            {/* FILE ONLY: Share */}
            {contextMenu.item.type === 'file' && (
                <button onClick={() => { const file = files.find(f => (f._id || f.id) === contextMenu.item.id); if (file) setShowShareModal(file); setContextMenu(null); }} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  <Share2 className="w-4 h-4 text-gray-500" />
                  <span>Share</span>
                </button>
            )}

            {/* FOLDER & FILE: Move to Trash */}
            <button onClick={() => { handleMoveToTrash(contextMenu.item.type, contextMenu.item.id, contextMenu.item.name); setContextMenu(null); }} className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t border-gray-100 mt-1 pt-1">
              <Trash2 className="w-4 h-4" />
              <span>Move to Trash</span>
            </button>
        </ContextMenu>
      )}

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload File">
        <FileUpload
          folderId={currentFolderId}
          onUploadComplete={() => {
            showToast('File uploaded successfully');
            refreshData(); // Refreshes both files and storage info
          }}
          onClose={() => setShowUploadModal(false)}
        />
      </Modal>

      <Modal isOpen={showNewFolderModal} onClose={() => setShowNewFolderModal(false)} title="Create New Folder">
        <form onSubmit={(e) => { e.preventDefault(); const name = e.currentTarget.name.value; if (name && name.trim()) { handleCreateFolder(name.trim()); } }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter folder name" />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setShowNewFolderModal(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Folder</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!showRenameModal} onClose={() => { setShowRenameModal(null); setRenameValue(''); }} title={`Rename ${showRenameModal?.type}`}>
        <form onSubmit={(e) => { e.preventDefault(); handleRename(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Name</label>
            <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => { setShowRenameModal(null); setRenameValue(''); }} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Rename</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!showShareModal} onClose={() => setShowShareModal(null)} title="Share File">
        {showShareModal && <ShareModal file={showShareModal} onClose={() => setShowShareModal(null)} />}
      </Modal>

      <Modal isOpen={!!showFolderShareModal} onClose={() => setShowFolderShareModal(null)} title="Public Folder Share">
        {showFolderShareModal && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold mb-1">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span>{showFolderShareModal.name}</span>
              </div>
              <p className="text-xs text-emerald-700">
                This folder is now public. Anyone with this link can view and download all files inside this folder.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Shareable Folder Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/share/folder/${showFolderShareModal.shareToken}`}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md select-all text-gray-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyFolderLink(showFolderShareModal.shareToken)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md flex items-center space-x-1 whitespace-nowrap cursor-pointer transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  handleToggleFolderVisibility(showFolderShareModal._id || showFolderShareModal.id, false);
                  setShowFolderShareModal(null);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Revoke & Make Private</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFolderShareModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DashboardPage;