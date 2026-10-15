import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import apiClient from './api/apiClient';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PublicSharePage from './pages/PublicSharePage';
import PublicFolderPage from './pages/PublicFolderPage';
import LandingPage from './pages/LandingPage';

// A helper component to handle the Google OAuth redirect
function GoogleAuthHandler({ onLogin }) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // We found a token, let's log the user in
      const performLogin = async () => {
        localStorage.setItem('jwt_token', token);
        try {
          const result = await apiClient.getCurrentUser();
          onLogin(token, result.user);
        } catch (error) {
          console.error("Failed to fetch user after Google login:", error);
          // Clear token if it's invalid
          localStorage.removeItem('jwt_token');
        }
      };
      performLogin();
    }
  }, [searchParams, onLogin]);

  // This component doesn't render anything, it just handles logic and redirects
  return <Navigate to="/" />;
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const result = await apiClient.getCurrentUser();
          setUser(result.user);
        } catch (error) {
          localStorage.removeItem('jwt_token');
          console.error('Authentication check failed:', error);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('jwt_token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Share Page Routes */}
        <Route path="/share/folder/:token" element={<PublicFolderPage />} />
        <Route path="/share/:token" element={<PublicSharePage />} />

        {/* Google OAuth Callback Routes */}
        <Route path="/auth-success" element={<GoogleAuthHandler onLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <Navigate to="/" /> : <GoogleAuthHandler onLogin={handleLogin} />} />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage onRegister={handleLogin} />}
        />

        {/* Main Dashboard / Protected Route */}
        <Route
          path="/*"
          element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <LandingPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;