// src/components/AdminCategoriasModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import AdminCategoriaForm from './AdminCategoriaForm.js';
import ConfirmModal from './ConfirmModal.js';
import { listCategoriaSkills, createCategoriaSkill, deleteCategoriaSkill } from '../services/categoriaSkillService.js';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? {
        hidden: { opacity: 0, x: '100vw' },
        visible: { opacity: 1, x: '0' },
        exit: { opacity: 0, x: '-100vw' }
      }
    : {
        hidden: { opacity: 0, x: '-100vw' },
        visible: { opacity: 1, x: '0' },
        exit: { opacity: 0, x: '100vw' }
      };
};

const AdminCategoriasModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);
  const variants = getModalVariants(direction);

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoria, setNewCategoria] = useState({ nombre: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  // Para determinar el patrón de imagen según el ancho de la ventana
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // Cargar categorías al montar el modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    listCategoriaSkills()
      .then((data) => {
        const cats = data.categorias || data;
        setCategorias(cats);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || t('adminCategoriasModal.errorLoad');
        setError(errMsg);
        setLoading(false);
        toast.error(err.message || t('adminCategoriasModal.errorLoad'));
      });
  }, [isOpen, t]);

  const filteredCategorias = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (!categoriaToDelete) return;
    deleteCategoriaSkill(categoriaToDelete, accessToken)
      .then(() => {
        setCategorias(categorias.filter(cat => cat.idCategoriaSkill !== categoriaToDelete));
        toast.success(t('adminCategoriasModal.toast.deleteSuccess'));
      })
      .catch((err) => {
        console.error('Error al eliminar categoría:', err);
        toast.error(t('adminCategoriasModal.toast.deleteError'));
      })
      .finally(() => {
        setConfirmOpen(false);
        setCategoriaToDelete(null);
      });
  };

  const handleDelete = (id) => {
    setCategoriaToDelete(id);
    setConfirmOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCategoria.nombre.trim()) {
      toast.error(t('adminCategoriasModal.toast.createMissingFields'));
      return;
    }
    createCategoriaSkill(newCategoria, accessToken)
      .then((response) => {
        setCategorias([...categorias, response.categoria]);
        setNewCategoria({ nombre: '' });
        toast.success(t('adminCategoriasModal.toast.createSuccess'));
      })
      .catch((err) => {
        console.error('Error al crear categoría:', err);
        toast.error(t('adminCategoriasModal.toast.createError'));
      });
  };

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
              className="modal-content admin-submodal categorias"
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
              <div className="admin-modal-body categorias">
                <div className="leftModal categorias">
                  <img src={imageSrc} alt={t('adminCategoriasModal.altImage')} />
                </div>
                <div className="rightModal categorias">
                  <h2>{t('adminCategoriasModal.title')}</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder={t('adminCategoriasModal.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {loading && <p>{t('adminCategoriasModal.loading')}</p>}
                  {error && <p className="error">{error}</p>}
                  <div className="projects-list">
                    {filteredCategorias.map((cat) => (
                      <div key={cat.idCategoriaSkill} className="project-item">
                        <div className="project-info">
                          <h3>{cat.nombre}</h3>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(cat.idCategoriaSkill)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  <AdminCategoriaForm
                    newCategoria={newCategoria}
                    setNewCategoria={setNewCategoria}
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
        message={t('adminCategoriasModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setCategoriaToDelete(null);
        }}
      />
    </>
  );
};

export default AdminCategoriasModal;
