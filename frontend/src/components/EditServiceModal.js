// src/components/EditServiceModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaBolt, FaChartLine, FaCubes, FaLayerGroup, FaMobileAlt, FaRobot } from 'react-icons/fa';
import { editServicio, uploadPortadaServicio, viewServicio } from '../services/servicioService.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ICON_OPTIONS = [
  { value: 'layers', label: 'Layers (Gestión Digital)', Icon: FaLayerGroup },
  { value: 'cubes',  label: 'Cubes (SaaS)',             Icon: FaCubes },
  { value: 'mobile', label: 'Mobile (Apps)',             Icon: FaMobileAlt },
  { value: 'robot',  label: 'Robot (IA & Bots)',         Icon: FaRobot },
  { value: 'chart',  label: 'Chart (BI & Datos)',        Icon: FaChartLine },
  { value: 'bolt',   label: 'Bolt (Automatización)',     Icon: FaBolt },
];

const EditServiceModal = ({ isOpen, service, onClose, onSave, accessToken }) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    icono: '',
    portada: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isOpen && service) {
      setFormValues({
        nombre: service.nombre || '',
        descripcion: service.descripcion || '',
        precio: service.precio || '',
        icono: service.icono || '',
        portada: service.Imagen?.ruta || '',
      });
      setPreviewUrl(service.Imagen?.ruta || null);
    }
  }, [isOpen, service]);

  if (!isOpen || !service) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
      const { nombre, descripcion, precio, icono, portada } = formValues;

      await editServicio(service.idServicio, {
        nombre,
        descripcion,
        precio,
        icono,
        idImagen: service.idImagen || null,
      }, accessToken);

      if (portada && typeof portada !== 'string') {
        await uploadPortadaServicio(service.idServicio, portada, accessToken);
      }

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

  const currentIcon = ICON_OPTIONS.find((o) => o.value === formValues.icono);

  return (
    <div className="modal-overlay edit-service-overlay" onClick={handleOverlayClick}>
      <div className="modal-content edit-service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>{t('editServiceModal.title')}</h3>

        <form className="new-project-form" onSubmit={handleSubmit}>
          <label htmlFor="es-nombre">{t('editServiceModal.serviceName')}</label>
          <input
            id="es-nombre"
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={handleChange}
          />
          {formValues.nombre?.includes('.') && (
            <p className="field-hint" style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
              <strong>Preview:</strong> {t(formValues.nombre)}
            </p>
          )}

          <label htmlFor="es-descripcion">{t('editServiceModal.description')}</label>
          <textarea
            id="es-descripcion"
            name="descripcion"
            value={formValues.descripcion}
            onChange={handleChange}
          />
          {formValues.descripcion?.includes('.') && (
            <p className="field-hint" style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
              <strong>Preview:</strong> {t(formValues.descripcion)}
            </p>
          )}

          <label htmlFor="es-precio">{t('editServiceModal.price')}</label>
          <input
            id="es-precio"
            type="number"
            name="precio"
            value={formValues.precio}
            onChange={handleChange}
          />

          <label htmlFor="es-icono">{t('editServiceModal.icon', 'Ícono')}</label>
          <select
            id="es-icono"
            name="icono"
            value={formValues.icono}
            onChange={handleChange}
            className="admin-icon-select"
          >
            <option value="">— Seleccionar ícono —</option>
            {ICON_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {currentIcon && (
            <div className="admin-icon-preview">
              <currentIcon.Icon /> <span>{currentIcon.label}</span>
            </div>
          )}

          <label htmlFor="es-portada">{t('editServiceModal.coverImage')}</label>
          <input
            id="es-portada"
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
