// src/components/layouts/VideoBackgroundManager.js
import React, { useEffect, useRef } from 'react';

const VIDEO_URLS = {
  inicio: '/videos/videoInicio.mp4',
  servicios: '/videos/fondoServicios.mp4',
  proyectos: '/videos/FondoProyectos.mp4',
  contacto: '/videos/fondoContacto.mp4',
  detalleProyecto: '/videos/FondoProyectos.mp4',
};

const VideoBackgroundManager = () => {
  const videoRefs = useRef({});

  useEffect(() => {
    Object.entries(VIDEO_URLS).forEach(([key, src]) => {
      if (!videoRefs.current[key]) {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        videoRefs.current[key] = video;
      }
    });

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        document.body.removeChild(video);
      });
    };
  }, []);

  return null;
};

export default VideoBackgroundManager;
