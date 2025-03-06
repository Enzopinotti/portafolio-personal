// src/components/AdminServiciosModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import AdminServicioForm from './AdminServicioForm.js';
import { listServicios, createServicio, deleteServicio } from '../services/servicioService.js';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal.js';
import { useTranslation } from 'react-i18next';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? { hidden: { opacity: 0, x: '100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '-100vw' } }
    : { hidden: { opacity: 0, x: '-100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '100vw' } };
};

const AdminServiciosModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);
  const variants = getModalVariants(direction);

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newServicio, setNewServicio] = useState({ nombre: '', descripcion: '', precio: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    listServicios()
      .then((data) => {
        // Se espera que el endpoint devuelva { servicios, ... } o un array
        setServicios(data.servicios || data);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || t('adminServiciosModal.errorLoad');
        setError(errMsg);
        setLoading(false);
        toast.error(errMsg);
      });
  }, [isOpen, t]);

  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newServicio.nombre.trim()) {
      toast.error(t('adminServiciosModal.toast.createMissingFields'));
      return;
    }
    createServicio(newServicio, accessToken)
      .then((response) => {
        setServicios([...servicios, response.servicio]);
        setNewServicio({ nombre: '', descripcion: '', precio: '' });
        toast.success(t('adminServiciosModal.toast.createSuccess'));
      })
      .catch((err) => {
        console.error('Error al crear servicio:', err);
        toast.error(t('adminServiciosModal.toast.createError'));
      });
  };

  const confirmDelete = () => {
    if (!servicioToDelete) return;
    deleteServicio(servicioToDelete, accessToken)
      .then(() => {
        setServicios(servicios.filter((s) => s.idServicio !== servicioToDelete));
        toast.success(t('adminServiciosModal.toast.deleteSuccess'));
      })
      .catch((err) => {
        console.error('Error al eliminar servicio:', err);
        toast.error(t('adminServiciosModal.toast.deleteError'));
      })
      .finally(() => {
        setConfirmOpen(false);
        setServicioToDelete(null);
      });
  };

  const handleDelete = (id) => {
    setServicioToDelete(id);
    setConfirmOpen(true);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/patronDos.png' : '/images/patronUno.png';

  const handleOverlayClick = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) return;
    onClose();
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="modal-overlay admin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="modal-content admin-submodal"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-submodal-header">
                <button className="back-button" onClick={onClose}>
                  <FaArrowLeft />
                </button>
                <button className="close-icon" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>
              <div className="admin-modal-body">
                <div className="leftModal">
                  <img src={imageSrc} alt={t('adminServiciosModal.altImage')} />
                </div>
                <div className="rightModal">
                  <h2>{t('adminServiciosModal.title')}</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder={t('adminServiciosModal.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {loading && <p>{t('adminServiciosModal.loading')}</p>}
                  {error && <p className="error">{error}</p>}
                  <div className="projects-list">
                    {filteredServicios.map((servicio) => (
                      <div key={servicio.idServicio} className="project-item">
                        <div className="project-info">
                          <h3>{servicio.nombre}</h3>
                          <p>{servicio.descripcion}</p>
                          <p>
                            {t('adminServicioForm.priceLabel')}: ${servicio.precio}
                          </p>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(servicio.idServicio)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  <AdminServicioForm
                    newServicio={newServicio}
                    setNewServicio={setNewServicio}
                    handleCreate={handleCreate}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={confirmOpen}
        message={t('adminServiciosModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setServicioToDelete(null);
        }}
      />
    </>
  );
};

export default AdminServiciosModal;