import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import MainConsole from './MainConsole';

function App() {
  const [session, setSession] = useState(null);

  const handleLoginSuccess = (userSession) => {
    setSession(userSession);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Login Page */}
        <Route path="/login" element={
          session ? <Navigate to="/app/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
        } />

        {/* Protected Dashboard Console */}
        <Route path="/app/*" element={
          session ? <MainConsole session={session} /> : <Navigate to="/login" replace />
        } />

        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;