import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme, darkTheme } from './theme';
import { ApiProvider } from './contexts/ApiContext';
import AuthGuard from './components/Auth/AuthGuard';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import MeetingsPage from './pages/MeetingsPage';
import MeetingTrackerPage from './pages/MeetingTrackerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import PositionsPage from './pages/PositionsPage';
import SettingsPage from './pages/SettingsPage';
import MeetingRoomsPage from './pages/MeetingRoomsPage';
import MeetingStartPage from './pages/MeetingStartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ApiProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* 認証不要のルート */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* 認証が必要なルート */}
            <Route path="/*" element={
              <AuthGuard>
                <AppLayout onThemeToggle={handleThemeToggle} isDarkMode={isDarkMode}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/meetings" element={<MeetingsPage />} />
                    <Route path="/meetings/:id/tracker" element={<MeetingTrackerPage />} />
                    <Route path="/meeting-start" element={<MeetingStartPage />} />
                    <Route path="/meeting-rooms" element={<MeetingRoomsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/positions" element={<PositionsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </AppLayout>
              </AuthGuard>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </ApiProvider>
  );
}

export default App;
