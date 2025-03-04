// src/components/ProfileModal.js
import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import ProfileForm from './ProfileForm.js';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, y: '-100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '100vh' }
      }
    : {
        hidden: { opacity: 0, y: '100vh' },
        visible: { opacity: 1, y: '0' },
        exit: { opacity: 0, y: '-100vh' }
      };
};

const ProfileModal = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  user,
  direction = 'forward'
}) => {
    const { t } = useTranslation();
    const variants = getModalVariants(direction);

    const handleOverlayClick = (e) => {
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (window.getSelection().toString().length > 0) return;
        onClose();
    };
    // Hook para detectar el ancho de la ventana
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
      // Seleccionar imagen según el ancho
    const imageSrc = windowWidth < 800 ? '/images/patronDos.png' : '/images/patronUno.png';
    return (
        <AnimatePresence mode="wait">
        {isOpen && (
            <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            >
            <motion.div
                className="modal-content profile-modal"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
            >
                
                <div className="modal-body">
                <div className="leftModal">
                <img src={imageSrc} alt="login" />
                </div>
                <div className="rightModal">
                    <button className="close-icon" onClick={onClose}>
                    <FaTimes />
                    </button>
                    <h2>{t('profile.title') || 'Mi Perfil'}</h2>
                    <ProfileForm user={user} onUpdateSuccess={onUpdateSuccess} />
                </div>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default ProfileModal;
