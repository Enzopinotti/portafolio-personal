// src/components/AdminServicioForm.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaBolt, FaChartLine, FaCubes, FaLayerGroup, FaMobileAlt, FaRobot,
} from 'react-icons/fa';

const ICON_OPTIONS = [
  { value: 'layers', label: 'Layers (Gestión Digital)', Icon: FaLayerGroup },
  { value: 'cubes',  label: 'Cubes (SaaS)',             Icon: FaCubes },
  { value: 'mobile', label: 'Mobile (Apps)',             Icon: FaMobileAlt },
  { value: 'robot',  label: 'Robot (IA & Bots)',         Icon: FaRobot },
  { value: 'chart',  label: 'Chart (BI & Datos)',        Icon: FaChartLine },
  { value: 'bolt',   label: 'Bolt (Automatización)',     Icon: FaBolt },
];

const AdminServicioForm = ({ newServicio, setNewServicio, handleCreate }) => {
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    setNewServicio({
      ...newServicio,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="new-project-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">{t('adminServicioForm.formTitle')}</h3>

      <label htmlFor="nombre">{t('adminServicioForm.nameLabel')}</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        placeholder={t('adminServicioForm.namePlaceholder')}
        value={newServicio.nombre || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="descripcion">{t('adminServicioForm.descriptionLabel')}</label>
      <textarea
        id="descripcion"
        name="descripcion"
        placeholder={t('adminServicioForm.descriptionPlaceholder')}
        value={newServicio.descripcion || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="precio">{t('adminServicioForm.priceLabel')}</label>
      <input
        id="precio"
        name="precio"
        type="number"
        step="0.01"
        placeholder={t('adminServicioForm.pricePlaceholder')}
        value={newServicio.precio || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="icono">{t('adminServicioForm.iconLabel', 'Ícono')}</label>
      <select
        id="icono"
        name="icono"
        value={newServicio.icono || ''}
        onChange={handleInputChange}
        className="admin-icon-select"
      >
        <option value="">{t('adminServicioForm.iconPlaceholder', '— Seleccionar ícono —')}</option>
        {ICON_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {newServicio.icono && (() => {
        const found = ICON_OPTIONS.find((o) => o.value === newServicio.icono);
        return found ? (
          <div className="admin-icon-preview">
            <found.Icon /> <span>{found.label}</span>
          </div>
        ) : null;
      })()}

      <button type="submit" className="submit-btn btn-standard">
        {t('adminServicioForm.submitButton')}
      </button>
    </form>
  );
};

export default AdminServicioForm;