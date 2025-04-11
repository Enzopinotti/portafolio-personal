// src/components/GlobalLightTrail.js
import React, { useEffect, useRef } from 'react';

const GlobalLightTrail = () => {
  const canvasRef = useRef();
  const trail = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < trail.current.length; i++) {
        const point = trail.current[i];
        const alpha = (1 - i / trail.current.length) ** 2.5;
        const radius = Math.max(1, 8 - i * 0.3);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(255,255,255,1)';
        ctx.fill();
      }
    };

    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = e => {
      trail.current.unshift({ x: e.clientX, y: e.clientY });
      if (trail.current.length > 30) trail.current.pop();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default GlobalLightTrail;
