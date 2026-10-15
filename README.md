# 🎨 AmritDrive - Frontend Client

> A modern, responsive Google Drive-like web application built with React 19, Vite, and Tailwind CSS. It features a complete file explorer, drag-and-drop uploads, inline previews for images, PDFs, and videos, folder navigation with breadcrumbs, password-protected public link sharing, and a real-time storage quota indicator.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Environment Variables (.env)](#-environment-variables-env)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [How the Frontend Works (Architecture & Flows)](#-how-the-frontend-works-architecture--flows)
  - [1. Authentication & Token Management](#1-authentication--token-management)
  - [2. Google OAuth 2.0 Flow](#2-google-oauth-20-flow)
  - [3. Centralized API Client (`apiClient.js`)](#3-centralized-api-client-apiclientjs)
  - [4. File Management State Hook (`useFileManager.js`)](#4-file-management-state-hook-usefilemanagerjs)
  - [5. File Uploads & Progress (`FileUpload.jsx`)](#5-file-uploads--progress-fileuploadjsx)
  - [6. Inline File Previews (`FilePreview.jsx`)](#6-inline-file-previews-filepreviewjsx)
  - [7. Share Modal & Links (`ShareModal.jsx`)](#7-share-modal--links-sharemodaljsx)
  - [8. Trash & Recovery (`TrashView.jsx`)](#8-trash--recovery-trashviewjsx)
- [Available Scripts](#-available-scripts)
- [Docker Deployment](#-docker-deployment)
- [Production Deployment (Vercel)](#-production-deployment-vercel)

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI library |
| **Vite 7** | Lightning-fast frontend build tool and dev server |
| **React Router DOM 7** | Client-side routing and protected routes |
| **Tailwind CSS 4** | Modern utility-first CSS styling |
| **Lucide React** | Consistent, lightweight SVG icon set |
| **Axios & Fetch API** | HTTP client for backend REST communication |

---

## 📂 Folder Structure

```text
frontend/
├── public/
│   └── vite.svg             # Favicon asset
├── src/
│   ├── api/
│   │   └── apiClient.js     # Centralized API service with auth headers & error handling
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── FileExplorer.jsx     # Grid view of folders and files with breadcrumbs
│   │   │   ├── Header.jsx           # Top bar: search input, user profile, logout
│   │   │   ├── Sidebar.jsx          # Upload button, folder button, navigation, storage bar
│   │   │   ├── SharedLinksView.jsx  # Active shared links list with revoke button
│   │   │   └── TrashView.jsx        # Trash bin with restore & permanent delete buttons
│   │   ├── ContextMenu.jsx  # Right-click context menu (Download, Rename, Share, Trash)
│   │   ├── FilePreview.jsx  # Fullscreen inline preview for PDFs, Images, and Videos
│   │   ├── FileUpload.jsx   # Drag-and-drop & file picker uploader with progress
│   │   ├── Modal.jsx        # Reusable modal backdrop and dialog component
│   │   ├── ShareModal.jsx   # Share dialog: expiry days, password, link generator
│   │   └── Toast.jsx        # Floating notifications for success and error messages
│   ├── hooks/
│   │   └── useFileManager.js# Custom React hook encapsulating all Drive state & actions
│   ├── pages/
│   │   ├── DashboardPage.jsx# Main protected application page
│   │   ├── LandingPage.jsx  # Public marketing page for non-logged-in visitors
│   │   ├── LoginPage.jsx    # Email & password sign-in + Google OAuth button
│   │   ├── PublicFolderPage.jsx # Public viewer & downloader for shared folders
│   │   ├── PublicSharePage.jsx # Public download page for shared link visitors
│   │   └── RegisterPage.jsx # New user registration page
│   ├── utils/
│   │   └── helpers.js       # formatFileSize (bytes to MB/GB) and formatDate helpers
│   ├── App.jsx              # Main routing & authentication provider
│   ├── index.css            # Tailwind directives and global styles
│   └── main.jsx             # React DOM root render
├── .env                     # Frontend environment variables
├── .dockerignore            # Excluded files for Docker build
├── Dockerfile               # Multi-stage build with Nginx static server
├── eslint.config.js         # ESLint configuration
├── nginx.conf               # Nginx server configuration with SPA routing & /api proxy
├── package.json             # Frontend dependencies & npm scripts
├── vercel.json              # Vercel SPA rewrite rule (/.* -> /index.html)
└── vite.config.js           # Vite config with React, Tailwind, and dev /api proxy
```

---

## ⚙️ Environment Variables (.env)

Create a `.env` file in the `frontend/` directory:

```env
# URL of your backend API server
# Production: https://amritdrive-backend.onrender.com
# Local development (direct): http://localhost:5000
# Local development (using Vite proxy): leave empty
VITE_API_URL=https://amritdrive-backend.onrender.com

# URL of your frontend application (used for generating share links)
VITE_FRONTEND_URL=https://amritdrive-frontend.vercel.app
```

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Set `VITE_API_URL=http://localhost:5000` in `.env` (or leave it blank to automatically use Vite's `/api` proxy).

### 3. Start Development Server
```bash
npm run dev
```

The frontend will run locally on:
```text
  VITE v7.3.7  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 💡 How the Frontend Works (Architecture & Flows)

### 1. Authentication & Token Management
* When a user logs in via `LoginPage.jsx` or registers via `RegisterPage.jsx`, the backend returns a signed **JWT token**.
* The token is stored in the browser's `localStorage` as `'jwt_token'`.
* On page refresh, `App.jsx` reads `localStorage.getItem('jwt_token')` and calls `apiClient.getCurrentUser()` to restore the user session.
* When logging out, `localStorage.removeItem('jwt_token')` is called and the user is redirected to the landing page.

### 2. Google OAuth 2.0 Flow
* On the login page, clicking **Sign in with Google** redirects the user to `/api/auth/google`.
* After authenticating with Google, the backend redirects back to the frontend at:
  `/auth-success?token=<jwt_token>`
* The `<GoogleAuthHandler />` component in `App.jsx` captures this query token from the URL, saves it to `localStorage`, loads the user profile, and navigates seamlessly to the dashboard.

### 3. Centralized API Client (`apiClient.js`)
* All HTTP requests flow through a single, unified `APIClient` class.
* **Automatic Auth Header**: Automatically attaches `Authorization: Bearer <token>` to requests when a token exists in `localStorage`.
* **Smart Content-Type**: Sets `Content-Type: application/json` for requests with JSON payloads, and omits it for `multipart/form-data` uploads (allowing the browser to set boundary headers) and GET requests.
* **Resilient Host Resolution**: If `VITE_API_URL` is empty, it uses relative `/api` paths, which Vite proxies to `http://localhost:5000` during local development.

### 4. File Management State Hook (`useFileManager.js`)
* The entire Drive state is cleanly encapsulated in this custom hook:
  * `currentFolderId`: ID of the currently active folder (`null` for root).
  * `breadcrumbs`: Array of history objects `[{ id: null, name: 'My Files' }, ...]`.
  * `files` and `folders`: Lists of active items.
  * `storageInfo`: Object containing `storageUsed` and `storageLimit` bytes.
  * `trashItems`: Soft-deleted files and folders.
  * `sharedLinks`: List of share links created by the user.
  * `searchQuery`: Filter string for searching files.
  * `refreshData()`: Refetches files, folders, and storage info simultaneously.

### 5. File Uploads & Progress (`FileUpload.jsx`)
* Supports **Drag-and-Drop** and native file browser selection.
* Automatically uploads to the active folder (`folderId`).
* Displays upload progress bar and reports detailed error messages (e.g. file size exceeded or unsupported MIME type) directly in the modal.

### 6. Inline File Previews (`FilePreview.jsx`)
* Clicking on any file opens a full-screen preview without downloading.
* Fetches binary blob via `downloadFile(fileId)` and creates an object URL (`URL.createObjectURL(blob)`).
* **Images**: Displayed directly with responsive scaling.
* **PDFs & Videos**: Embedded in an interactive viewport.
* Automatically revokes object URLs on unmount to prevent browser memory leaks.

### 7. Share Modal & Links (`ShareModal.jsx`)
* Right-clicking any file opens the context menu with a **Share** option.
* Users can set:
  * **Expiration in Days** (optional).
  * **Password Protection** (optional).
* Generates a link: `https://amritdrive-frontend.vercel.app/share/<token>`.
* Includes a one-click **Copy Link** button with clipboard feedback.

### 8. Trash & Recovery (`TrashView.jsx`)
* Shows all soft-deleted files and folders.
* **Restore Button**: Restores the item back to its original location.
* **Permanent Delete**: Deletes the file forever from both database and server storage.
* **Empty Trash**: Deletes all items in a single click and instantly frees up user storage quota.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev Server** | `npm run dev` | Runs Vite dev server with Hot Module Replacement on `http://localhost:5173` |
| **Production Build** | `npm run build` | Compiles and optimizes assets into the `dist/` directory |
| **Linting** | `npm run lint` | Runs ESLint across all `.js` and `.jsx` files |
| **Preview Build** | `npm run preview` | Locally serves the compiled production `dist/` bundle |

---

## 🐳 Docker Deployment

The frontend includes a multi-stage [Dockerfile](file:///home/amritkeshari/amrit-drive-mern/frontend/Dockerfile) and [nginx.conf](file:///home/amritkeshari/amrit-drive-mern/frontend/nginx.conf):
1. **Stage 1**: Builds static assets using Node 20.
2. **Stage 2**: Serves static files using lightweight Nginx Alpine with SPA fallback routing.

```bash
# Build frontend image
docker build -t amritdrive-frontend ./frontend

# Run container on port 3000
docker run -d -p 3000:80 --name amritdrive-frontend amritdrive-frontend
```

---

## ☁️ Production Deployment (Vercel)

The frontend is pre-configured for instant deployment on [Vercel](https://vercel.com):

1. Import your frontend repository on Vercel.
2. **Framework Preset**: Vite.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   * `VITE_API_URL`: `https://amritdrive-backend.onrender.com`
   * `VITE_FRONTEND_URL`: `https://amritdrive-frontend.vercel.app`
6. `vercel.json` ensures that all browser routes (e.g. `/dashboard`, `/share/:token`, `/login`) are rewritten to `/index.html` so client-side routing works without 404 errors.
