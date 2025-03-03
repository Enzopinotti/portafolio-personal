// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getProfile, logoutUser, refreshAccessToken } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Cargar token de localStorage al inicio
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // 2) Cada vez que cambie el accessToken, intentamos obtener el perfil
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getProfile(accessToken);
        setUser(profile);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        setUser(null);
        // Podrías intentar un refresh token aquí si el error es "Token expirado"
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const login = (token) => {
    // Guardar token en localStorage y estado
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await logoutUser(); // este endpoint limpia el refresh token en BD
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    // Limpia todo
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
  };

  // 3) Manejo manual de refresh si quieres (opcional)
  const handleTokenRefresh = async () => {
    try {
      // Llamar a /usuarios/refresh (ver 2.3)
      const newToken = await refreshAccessToken(); // Retorna { accessToken }
      if (newToken?.accessToken) {
        login(newToken.accessToken);
      }
    } catch (err) {
      console.error('No se pudo refrescar el token:', err);
      logout(); // o forzar logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
        handleTokenRefresh,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
