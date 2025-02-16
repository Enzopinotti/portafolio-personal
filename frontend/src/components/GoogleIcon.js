// src/components/GoogleIcon.js
import React from 'react';

const GoogleIcon = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    width="18"
    height="18"
    viewBox="0 0 48 48"
  >
    <path fill="#EA4335" d="M24 9.5c3.95 0 6.83 1.69 8.39 3.11l5.84-5.84C33.48 4.3 29.21 2 24 2 14.64 2 6.68 7.76 3.44 16.1l6.79 5.27C12.98 15.14 17.67 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.8 24.5c0-1.64-.15-3.22-.43-4.72H24v9h12.85c-.55 3-2.17 5.56-4.64 7.24l7.2 5.57c4.21-3.87 6.65-9.58 6.65-17.09z"/>
    <path fill="#FBBC05" d="M10.23 28.97a14.05 14.05 0 0 1-.75-4.47c0-1.56.27-3.06.75-4.47l-6.79-5.27a23.84 23.84 0 0 0 0 18.5l6.79-5.27z"/>
    <path fill="#34A853" d="M24 46c5.21 0 9.6-1.72 12.8-4.65l-7.2-5.57c-2 1.34-4.56 2.13-5.6 2.13-4.3 0-7.95-2.9-9.27-6.82l-6.79 5.27C6.68 40.24 14.64 46 24 46z"/>
    <path fill="none" d="M2 2h44v44H2z"/>
  </svg>
);

export default GoogleIcon;
