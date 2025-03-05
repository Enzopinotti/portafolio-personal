// src/components/ConfirmModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  const variants = {
    hidden: { opacity: 0, y: '-20px' },
    visible: { opacity: 1, y: '0' },
    exit: { opacity: 0, y: '20px' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="confirm-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel} // Cierra al hacer click afuera
        >
          <motion.div
            className="confirm-modal-content"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="confirm-close" onClick={onCancel}>
              <FaTimes />
            </button>
            <p className="confirm-message">{message}</p>
            <div className="confirm-buttons">
              <button className="btn-confirm" onClick={onConfirm}>
                Sí
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                No
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
