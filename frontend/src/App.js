// src/App.js
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import NavigationProvider from './context/NavigationContext.js';
import Layout from './components/layouts/Layout.js';
import EmailConfirmationModal from './components/EmailConfirmationModal.js';
import ResetPasswordModal from './components/ResetPasswordModal.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = ({ onShowForgotPassword }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    // Si el path es /reset-password y hay token, mostramos el modal de reset
    if (location.pathname === '/reset-password' && resetToken) {
      setToken(resetToken);
      setShowResetPassword(true);
      navigate('/', { replace: true });
    } else {
      // Si hay token y el path es /confirm-email, mostramos el modal de confirmación
      const confirmToken = params.get('token');
      if (confirmToken) {
        setToken(confirmToken);
        setShowEmailConfirmation(true);
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate]);

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
          onGoToForgotPassword={() => {
            setShowEmailConfirmation(false);
            // Opcional: abrir modal de forgot password si se desea
          }}
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
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </NavigationProvider>
    </Router>
  );
}

export default App;
