// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getProfile, logoutUser, refreshAccessToken } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Carga inicial y restauración de sesión
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');

      if (storedToken) {
        setAccessToken(storedToken);
        try {
          const profile = await getProfile(storedToken);
          setUser(profile);
        } catch (error) {
          console.warn('Token guardado inválido o expirado, intentando refresh silencioso...');
          await handleTokenRefresh();
        }
      } else {
        // Si no hay token en localStorage, intentamos un refresh silencioso 
        // por si hay una cookie de refreshToken válida
        await handleTokenRefresh();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2) Sincronizar el token con localStorage cuando cambie el estado
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  const login = (token) => {
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

  // 3) Manejo de refresh token (silencioso)
  const handleTokenRefresh = async () => {
    try {
      const data = await refreshAccessToken();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        const profile = await getProfile(data.accessToken);
        setUser(profile);
        return true;
      }
    } catch (err) {
      console.log('Sesión no encontrada o expirada.');
      setUser(null);
      setAccessToken(null);
      return false;
    }
    return false;
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
