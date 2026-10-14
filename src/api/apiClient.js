const apiHost = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : '';

const API_BASE = apiHost ? `${apiHost}/api` : '/api';

export const getApiHost = () => apiHost;

class APIClient {
  getAuthToken() {
    return localStorage.getItem('jwt_token');
  }

  getAuthHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async handleResponse(response) {
    if (response.headers.get('content-type')?.includes('application/json') === false) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  }

  // Auth endpoints
  async register(name, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return this.handleResponse(response);
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Folder endpoints
  async createFolder(name, parentId) {
    const response = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, parentId: parentId || null }),
    });
    return this.handleResponse(response);
  }

  async getFolders(parentId) {
    const params = new URLSearchParams();
    params.append('parentId', parentId || '');
    const response = await fetch(`${API_BASE}/folders?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateFolder(folderId, name) {
    const response = await fetch(`${API_BASE}/folders/${folderId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse(response);
  }

  // File endpoints
  async uploadFile(file, folderId, name) {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    if (name) formData.append('name', name);

    const token = this.getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getFiles(folderId, page = 1, limit = 50, search) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    params.append('folderId', folderId || '');
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE}/files?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async downloadFile(fileId) {
    const response = await fetch(`${API_BASE}/files/${fileId}/download`, {
      headers: this.getAuthHeaders(),
    });
    // For downloads, we return the raw response to process the blob
    return response;
  }

  async renameFile(fileId, name) {
    const response = await fetch(`${API_BASE}/files/${fileId}/rename`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse(response);
  }

  async moveFile(fileId, folderId) {
    const response = await fetch(`${API_BASE}/files/${fileId}/move`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ folderId: folderId || null }),
    });
    return this.handleResponse(response);
  }

  // Trash endpoints
  async moveToTrash(type, id) {
    const response = await fetch(`${API_BASE}/trash/move`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ type, id }),
    });
    return this.handleResponse(response);
  }

  async getTrashItems(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await fetch(`${API_BASE}/trash?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async restoreFromTrash(type, id) {
    const response = await fetch(`${API_BASE}/trash/restore`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ type, id }),
    });
    return this.handleResponse(response);
  }

  async permanentDelete(type, id) {
    const response = await fetch(`${API_BASE}/trash/delete`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ type, id }),
    });
    return this.handleResponse(response);
  }

  async emptyTrash() {
    const response = await fetch(`${API_BASE}/trash/empty`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Share endpoints
  async createShare(fileId, expiresIn, password) {
    const body = { fileId };
    if (expiresIn) body.expiresIn = expiresIn;
    if (password) body.password = password;

    const response = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getShares(page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await fetch(`${API_BASE}/share?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteShare(shareId) {
    const response = await fetch(`${API_BASE}/share/${shareId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // --- THESE ARE THE NEW FUNCTIONS, NOW PLACED *INSIDE* THE CLASS ---

  // Fetches public metadata for a shared file
  async getShareInfo(token) {
    // Note: This is a public endpoint, so no auth headers are needed.
    const response = await fetch(`${API_BASE}/share/${token}/info`);
    return this.handleResponse(response);
  }

  // Downloads a shared file, sending a password if required
  async downloadSharedFile(token, password) {
    const response = await fetch(`${API_BASE}/share/${token}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    // Return the raw response for blob processing
    return response;
  }
} // <-- This is the final closing brace for the class

const apiClient = new APIClient();
export default apiClient;