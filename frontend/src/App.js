// src/App.js
import React, { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import NavigationProvider from './context/NavigationContext.js';
import Layout from './components/layouts/Layout.js';
import EmailConfirmationModal from './components/EmailConfirmationModal.js';
import ResetPasswordModal from './components/ResetPasswordModal.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext.js';
import { SettingsProvider } from './context/SettingsContext.js';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Importar la función "login" desde AuthContext
  const { login } = useContext(AuthContext);

  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    const accessToken = params.get('accessToken');

    // Manejar reset password
    if (location.pathname === '/reset-password' && resetToken) {
      setToken(resetToken);
      setShowResetPassword(true);
      navigate('/', { replace: true });
    } else {
      // Manejar email confirmation
      const confirmToken = params.get('token');
      if (confirmToken) {
        setToken(confirmToken);
        setShowEmailConfirmation(true);
        navigate('/', { replace: true });
      }
    }

    // Manejar login con Google (accessToken en query param)
    if (accessToken) {
      // Llamamos a login(...) del AuthContext
      login(accessToken);

      // Quitar el query param de la URL
      window.history.replaceState({}, '', '/');
    }
  }, [location, navigate, login]);

  const handleGoToLogin = () => {
    setShowEmailConfirmation(false);
    setShowResetPassword(false);
    navigate('/');
  };

  const handleResetSuccess = () => {
    setShowResetPassword(false);
    navigate('/');
  };

  return (
    <>
      <Layout />
      <ToastContainer position="top-right" autoClose={3000} />
      
      {showEmailConfirmation && (
        <EmailConfirmationModal
          isOpen={showEmailConfirmation}
          onClose={() => setShowEmailConfirmation(false)}
          onGoToLogin={handleGoToLogin}
          token={token}
        />
      )}

      {showResetPassword && (
        <ResetPasswordModal
          isOpen={showResetPassword}
          onClose={() => setShowResetPassword(false)}
          onResetSuccess={handleResetSuccess}
          token={token}
        />
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <NavigationProvider>
        <SettingsProvider>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </AuthProvider>
        </SettingsProvider>
      </NavigationProvider>
    </Router>
  );
}

export default App;
