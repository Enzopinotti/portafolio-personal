// src/components/AdminServiciosModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

import AdminServicioForm from './AdminServicioForm.js';
import ServiceActionsDropdown from './ServiceActionsDropdown.js';
import ConfirmModal from './ConfirmModal.js';
import EditServiceModal from './EditServiceModal.js'; // Modal de edición

import {
  listServicios,
  createServicio,
  deleteServicio
} from '../services/servicioService.js';

import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Animaciones de Framer Motion
const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, x: '100vw' },
        visible: { opacity: 1, x: '0' },
        exit: { opacity: 0, x: '-100vw' },
      }
    : {
        hidden: { opacity: 0, x: '-100vw' },
        visible: { opacity: 1, x: '0' },
        exit: { opacity: 0, x: '100vw' },
      };
};

const AdminServiciosModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);
  const variants = getModalVariants(direction);

  // Estados principales
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Búsqueda por nombre
  const [searchTerm, setSearchTerm] = useState('');

  // Crear servicio
  const [newServicio, setNewServicio] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
  });

  // Confirmación de eliminación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState(null);

  // Edición: modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [servicioToEdit, setServicioToEdit] = useState(null);
  console.log('Servicio a editar:', servicioToEdit);
  // Efecto: cargar lista de servicios al abrir el modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    listServicios()
      .then((data) => {
        // data puede ser { servicios, ... } o un array
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

  // Filtrar por searchTerm
  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Crear servicio
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newServicio.nombre.trim()) {
      toast.error(t('adminServiciosModal.toast.createMissingFields'));
      return;
    }
    try {
      const response = await createServicio(newServicio, accessToken);
      setServicios((prev) => [...prev, response.servicio]);
      setNewServicio({ nombre: '', descripcion: '', precio: '' });
      toast.success(t('adminServiciosModal.toast.createSuccess'));
    } catch (err) {
      console.error('Error al crear servicio:', err);
      toast.error(t('adminServiciosModal.toast.createError'));
    }
  };

  // Eliminar servicio
  const handleDelete = (id) => {
    setServicioToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!servicioToDelete) return;
    try {
      await deleteServicio(servicioToDelete, accessToken);
      setServicios((prev) =>
        prev.filter((s) => s.idServicio !== servicioToDelete)
      );
      toast.success(t('adminServiciosModal.toast.deleteSuccess'));
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      toast.error(t('adminServiciosModal.toast.deleteError'));
    } finally {
      setConfirmOpen(false);
      setServicioToDelete(null);
    }
  };

  // Editar servicio
  const handleEditService = (servicio) => {
    setServicioToEdit(servicio);
    setEditModalOpen(true);
  };

  // Manejo de la ventana (overlay)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // Cerrar el modal si se hace click afuera (overlay)
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
              className="modal-content admin-submodal servicios"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="admin-submodal-header">
                <button className="back-button" onClick={onClose}>
                  <FaArrowLeft />
                </button>
                <button className="close-icon" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>

              {/* Body */}
              <div className="admin-modal-body servicios">
                {/* Left Panel */}
                <div className="leftModal servicios">
                  <img src={imageSrc} alt={t('adminServiciosModal.altImage')} />
                </div>

                {/* Right Panel */}
                <div className="rightModal servicios">
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

                  {/* Lista de servicios */}
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

                        {/* Dropdown con editar/eliminar */}
                        <ServiceActionsDropdown
                          onEdit={() => handleEditService(servicio)}
                          onDelete={() => handleDelete(servicio.idServicio)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Formulario para crear servicio */}
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

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={confirmOpen}
        message={t('adminServiciosModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setServicioToDelete(null);
        }}
      />

      {/* Modal para editar */}
      <EditServiceModal
        isOpen={editModalOpen}
        service={servicioToEdit}
        onClose={() => {
          setEditModalOpen(false);
          setServicioToEdit(null);
        }}
        onSave={(updatedServicio) => {
          // Reemplazar en el estado local
          setServicios((prev) =>
            prev.map((s) => (s.idServicio === updatedServicio.idServicio ? updatedServicio : s))
          );
        }}
        accessToken={accessToken}
      />
    </>
  );
};

export default AdminServiciosModal;