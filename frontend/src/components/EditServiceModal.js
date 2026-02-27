// src/components/EditServiceModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { editServicio, uploadPortadaServicio, viewServicio } from '../services/servicioService.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EditServiceModal = ({ isOpen, service, onClose, onSave, accessToken }) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    portada: '', // string o File
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isOpen && service) {
      setFormValues({
        nombre: service.nombre || '',
        descripcion: service.descripcion || '',
        precio: service.precio || '',
        portada: service.Imagen?.ruta || '',
      });
      setPreviewUrl(service.Imagen?.ruta || null);
    }
  }, [isOpen, service]);

  if (!isOpen || !service) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormValues((prev) => ({ ...prev, portada: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setFormValues((prev) => ({ ...prev, portada: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { nombre, descripcion, precio, portada } = formValues;

      // (1) Actualizar texto
      await editServicio(service.idServicio, {
        nombre,
        descripcion,
        precio,
        idImagen: service.idImagen || null,
      }, accessToken);

      // (2) Subir nueva portada si hay un File
      if (portada && typeof portada !== 'string') {
        await uploadPortadaServicio(service.idServicio, portada, accessToken);
      }

      // (3) Traer el servicio actualizado (con imagen)
      const finalServicio = await viewServicio(service.idServicio);

      toast.success('Servicio actualizado con éxito');
      onSave(finalServicio);
      onClose();
    } catch (err) {
      console.error('Error al editar servicio:', err);
      toast.error('No se pudo actualizar el servicio');
    }
  };

  const handleOverlayClick = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) return;
    onClose();
  };

  return (
    <div className="modal-overlay edit-service-overlay" onClick={handleOverlayClick}>
      <div className="modal-content edit-service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>{t('editServiceModal.title')}</h3>

        <form className="new-project-form" onSubmit={handleSubmit}>
          <label htmlFor="nombre">{t('editServiceModal.serviceName')}</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={handleChange}
          />

          <label htmlFor="descripcion">{t('editServiceModal.description')}</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formValues.descripcion}
            onChange={handleChange}
          />

          <label htmlFor="precio">{t('editServiceModal.price')}</label>
          <input
            id="precio"
            type="number"
            name="precio"
            value={formValues.precio}
            onChange={handleChange}
          />

          <label htmlFor="portada">{t('editServiceModal.coverImage')}</label>
          <input
            id="portada"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {previewUrl && (
            <div className="preview-pastilla">
              <img src={previewUrl} alt={t('editServiceModal.currentCover')} className="preview-img" />
              <button type="button" className="close-button" onClick={handleRemovePreview}>✕</button>
            </div>
          )}

          <button type="submit">{t('editServiceModal.save')}</button>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
