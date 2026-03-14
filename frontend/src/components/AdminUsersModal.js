// src/components/AdminUsersModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes, FaEdit } from 'react-icons/fa';
import AdminUserForm from './AdminUserForm.js';
import ConfirmModal from './ConfirmModal.js';
import EditUserModal from './EditUserModal.js';
import Loader from './shared/Loader.js';
import { listAdminUsers, createAdminUser, deleteAdminUser } from '../services/userService.js';
import { listRoles } from '../services/rolService.js'; // Asegúrate de tener esta función
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? { hidden: { opacity: 0, x: '100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '-100vw' } }
    : { hidden: { opacity: 0, x: '-100vw' }, visible: { opacity: 1, x: '0' }, exit: { opacity: 0, x: '100vw' } };
};

const AdminUsersModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const { accessToken } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ nombre: '', apellido: '', email: '', contraseña: '', idRol: '' });

  // Estado para confirmación de eliminación y edición
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Responsive: imagen de fondo
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const imageSrc = windowWidth < 800 ? '/images/PatronDos.png' : '/images/patronUno.png';

  // Cargar usuarios al abrir el modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    listAdminUsers({}, accessToken)
      .then((data) => {
        setUsers(data.usuarios || data);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || t('adminUsersModal.errorLoad');
        setError(errMsg);
        setLoading(false);
        toast.error(errMsg);
      });
  }, [isOpen, t, accessToken]);

  // Cargar roles al abrir el modal
  useEffect(() => {
    if (!isOpen) return;
    listRoles()
      .then((data) => {
        setRoles(data.roles || data);
      })
      .catch((err) => {
        console.error('Error al cargar roles:', err);
        toast.error(err.message || 'Error loading roles');
      });
  }, [isOpen]);

  const filteredUsers = (users || []).filter(user => {
    const name = user?.nombre || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const confirmDelete = () => {
    if (!userToDelete) return;
    deleteAdminUser(userToDelete, accessToken)
      .then(() => {
        setUsers(users.filter(user => user.idUsuario !== userToDelete));
        toast.success(t('adminUsersModal.toast.deleteSuccess'));
      })
      .catch((err) => {
        console.error('Error al eliminar usuario:', err);
        toast.error(t('adminUsersModal.toast.deleteError'));
      })
      .finally(() => {
        setConfirmOpen(false);
        setUserToDelete(null);
      });
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newUser.nombre.trim() || !newUser.email.trim() || !newUser.contraseña.trim()) {
      toast.error(t('adminUsersModal.toast.createMissingFields'));
      return;
    }
    createAdminUser(newUser, accessToken)
      .then((response) => {
        setUsers([...users, response.usuario]);
        setNewUser({ nombre: '', apellido: '', email: '', contraseña: '', idRol: '' });
        toast.success(t('adminUsersModal.toast.createSuccess'));
      })
      .catch((err) => {
        console.error('Error al crear usuario:', err);
        toast.error(t('adminUsersModal.toast.createError'));
      });
  };

  const handleOverlayClick = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) return;
    onClose();
  };

  const variants = getModalVariants(direction);

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
              className="modal-content admin-submodal usuarios"
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
                  <img src={imageSrc} alt={t('adminUsersModal.altImage', 'Users Pattern')} />
                </div>
                <div className="rightModal">
                  <h2>{t('adminUsersModal.title')}</h2>
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder={t('adminUsersModal.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {loading && <Loader message={t('adminUsersModal.loading')} />}
                  {error && <p className="error">{error}</p>}

                  <div className="admin-section-title">
                    {t('adminUsersModal.currentUsers', 'Usuarios Actuales')}
                  </div>
                  <div className="projects-list">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div key={user.idUsuario} className="project-item">
                          <div className="project-info">
                            <h3>{user.nombre}</h3>
                            <p>{user.email}</p>
                          </div>
                          <div className="item-actions" style={{ display: 'flex', gap: '0.8rem' }}>
                            <button
                              className="edit-button"
                              onClick={() => handleEditUser(user)}
                              title={t('adminUsersModal.actions.editUser', 'Editar Usuario')}
                              style={{ background: '#ebf4ff', border: 'none', color: '#3182ce', width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(user.idUsuario)}
                              title={t('adminUsersModal.actions.deleteUser')}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>{t('adminUsersModal.noUsers')}</p>
                    )}
                  </div>
                  <div className="admin-section-title">
                    {t('adminUsersModal.addNew', 'Nuevo Usuario')}
                  </div>
                  <AdminUserForm
                    newUser={newUser}
                    setNewUser={setNewUser}
                    handleCreate={handleCreate}
                    roles={roles}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={confirmOpen}
        message={t('adminUsersModal.confirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setUserToDelete(null);
        }}
      />
      <EditUserModal
        isOpen={editModalOpen}
        user={userToEdit}
        roles={roles}
        onClose={() => {
          setEditModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={(updatedUser) => {
          setUsers(prev => prev.map(u => u.idUsuario === updatedUser.idUsuario ? updatedUser : u));
          setEditModalOpen(false);
          setUserToEdit(null);
        }}
      />
    </>
  );
};

export default AdminUsersModal;
