// src/components/EditUserModal.js
import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

import AdminUserForm from './AdminUserForm.js';
import { updateAdminUser } from '../services/userService.js';
import { AuthContext } from '../context/AuthContext.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EditUserModal = ({ isOpen, user, onClose, onSave, roles }) => {
    const { t } = useTranslation();
    const { accessToken } = useContext(AuthContext);

    const [editedUser, setEditedUser] = useState({
        idUsuario: '',
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '', // se deja vacía por defecto
        idRol: ''
    });

    useEffect(() => {
        if (user) {
            setEditedUser({
                idUsuario: user.idUsuario,
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                email: user.email || '',
                contraseña: '', // Si se escribe algo, se enviará para cambiar
                idRol: user.Rol?.idRol || user.idRol || ''
            });
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const dataToUpdate = {
                nombre: editedUser.nombre,
                apellido: editedUser.apellido,
                email: editedUser.email,
                idRol: editedUser.idRol,
            };

            if (editedUser.contraseña) {
                dataToUpdate.contraseña = editedUser.contraseña;
            }

            await updateAdminUser(editedUser.idUsuario, dataToUpdate, accessToken);

            if (onSave) {
                // Obtenemos el role name de form
                const selectedRole = roles.find(r => String(r.idRol) === String(editedUser.idRol));
                const updatedUser = {
                    ...user,
                    nombre: editedUser.nombre,
                    apellido: editedUser.apellido,
                    email: editedUser.email,
                    idRol: editedUser.idRol,
                    Rol: selectedRole ? { idRol: selectedRole.idRol, nombre: selectedRole.nombre } : user.Rol
                };
                onSave(updatedUser);
            }

            toast.success(t('adminUsersModal.toast.editSuccess', 'Usuario editado con éxito'));
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(t('adminUsersModal.toast.editError', 'Error al editar el usuario'));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay admin-overlay"
                    style={{ zIndex: 2200 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content admin-submodal usuarios"
                        initial={{ y: 50 }}
                        animate={{ y: 0 }}
                        exit={{ y: -50 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxHeight: '90vh' }}
                    >
                        <div className="admin-submodal-header">
                            <button className="close-icon" onClick={onClose}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="rightModal" style={{ width: '100%', maxWidth: '100%' }}>
                                <h2>{t('adminUsersModal.actions.editUser', 'Editar Usuario')}</h2>

                                <AdminUserForm
                                    newUser={editedUser}
                                    setNewUser={setEditedUser}
                                    handleCreate={handleSave}
                                    roles={roles}
                                    isEditing={true}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditUserModal;
