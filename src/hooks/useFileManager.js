import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export const useFileManager = (currentView) => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Files' }]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [trashItems, setTrashItems] = useState({ files: [], folders: [] });
  const [sharedLinks, setSharedLinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageInfo, setStorageInfo] = useState({ storageUsed: 0, storageLimit: 1 });

  const fetchStorageInfo = useCallback(async () => {
    try {
      const result = await apiClient.getCurrentUser();
      if (result.user && result.user.storageInfo) {
        setStorageInfo(result.user.storageInfo);
      }
    } catch (error) {
      console.error("Could not fetch user storage info:", error);
    }
  }, []);

  const loadExplorerData = useCallback(async () => {
    try {
      const [foldersRes, filesRes] = await Promise.all([
        apiClient.getFolders(currentFolderId),
        apiClient.getFiles(currentFolderId, 1, 100, searchQuery),
      ]);
      setFolders(foldersRes.folders);
      setFiles(filesRes.files);
    } catch (error) {
      console.error('Failed to load explorer data:', error);
    }
  }, [currentFolderId, searchQuery]);

  const loadTrashItems = useCallback(async () => {
    try {
      const result = await apiClient.getTrashItems();
      setTrashItems({ files: result.files || [], folders: result.folders || [] });
    } catch (error) {
      console.error('Failed to load trash items:', error);
    }
  }, []);

  const loadSharedLinks = useCallback(async () => {
    try {
      const result = await apiClient.getShares();
      setSharedLinks(result.shares);
    } catch (error) {
      console.error('Failed to load shared links:', error);
    }
  }, []);

  useEffect(() => {
    fetchStorageInfo();
  }, [fetchStorageInfo]);

  useEffect(() => {
    if (currentView === 'explorer') {
      loadExplorerData();
    } else if (currentView === 'trash') {
      loadTrashItems();
    } else if (currentView === 'sharedLinks') {
      loadSharedLinks();
    }
  }, [currentView, loadExplorerData, loadTrashItems, loadSharedLinks]);

  const refreshData = () => {
    if (currentView === 'explorer') loadExplorerData();
    if (currentView === 'trash') loadTrashItems();
    if (currentView === 'sharedLinks') loadSharedLinks();
    fetchStorageInfo();
  };

  const navigateToFolder = (folderId, folderName) => {
    const newBreadcrumb = { id: folderId, name: folderName };
    const existingIndex = breadcrumbs.findIndex(bc => bc.id === folderId);
    if (existingIndex !== -1) {
      setBreadcrumbs(prev => prev.slice(0, existingIndex + 1));
    } else {
      setBreadcrumbs(prev => [...prev, newBreadcrumb]);
    }
    setCurrentFolderId(folderId);
  };

  const navigateToBreadcrumb = (index) => {
    const targetBreadcrumb = breadcrumbs[index];
    setCurrentFolderId(targetBreadcrumb.id);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  return {
    currentFolderId,
    folders,
    files,
    trashItems,
    sharedLinks,
    storageInfo,
    breadcrumbs,
    searchQuery,
    setSearchQuery,
    navigateToFolder,
    navigateToBreadcrumb,
    refreshData,
    loadExplorerData,
  };
};