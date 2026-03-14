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

      if (trail.current.length > 0) {
        trail.current = trail.current.filter(p => {
          p.life = (p.life || 1) - 0.04;
          p.x += (Math.random() - 0.5) * 1.2;
          p.y += (Math.random() - 0.5) * 1.2;
          return p.life > 0;
        });
      }

      for (let i = 0; i < trail.current.length; i++) {
        const point = trail.current[i];
        const life = point.life || 1;
        const radius = Math.max(1.5, (10 - i * 0.35) * life);

        const pointColor = point.color || '255, 255, 255';
        const pointShadow = point.shadow || 'white';

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);

        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 2);
        gradient.addColorStop(0, `rgba(${pointColor}, ${life})`);
        gradient.addColorStop(0.5, `rgba(${pointColor}, ${life * 0.5})`);
        gradient.addColorStop(1, `rgba(${pointColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.shadowBlur = i === 0 ? 25 * life : 15 * life;
        ctx.shadowColor = pointShadow;
        ctx.fill();
      }
    };

    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerMove = e => {
      const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : undefined);
      const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : undefined);

      if (x !== undefined && y !== undefined) {
        // Detectar si el puntero está sobre un área blanca (modales)
        const target = document.elementFromPoint(x, y);
        const isWhiteArea = !!target?.closest('.modal-content, .admin-submodal, .admin-modal, .profile-modal-content, .auth-modal-content, .confirm-modal-content');

        const pointColor = isWhiteArea ? '0, 0, 0' : '255, 255, 255';
        const pointShadow = isWhiteArea ? 'rgba(0,0,0,0.5)' : 'white';

        const lastPoint = trail.current[0];
        if (!lastPoint || Math.hypot(x - lastPoint.x, y - lastPoint.y) > 3) {
          trail.current.unshift({ x, y, life: 1, color: pointColor, shadow: pointShadow });
          if (trail.current.length > 30) trail.current.pop();
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
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
        mixBlendMode: 'normal',
      }}
    />
  );
};

export default GlobalLightTrail;
