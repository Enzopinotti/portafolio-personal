// src/components/AdminSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { getSettings, updateSettings } from '../services/adminSettingsService.js';
import { toast } from 'react-toastify';

const getModalVariants = (direction = 'forward') => {
  return direction === 'forward'
    ? { hidden: { opacity: 0, y: '-100vh' }, visible: { opacity: 1, y: '0' }, exit: { opacity: 0, y: '100vh' } }
    : { hidden: { opacity: 0, y: '100vh' }, visible: { opacity: 1, y: '0' }, exit: { opacity: 0, y: '-100vh' } };
};

const AdminSettingsModal = ({ isOpen, onClose, direction = 'forward' }) => {
  const { t } = useTranslation();
  const variants = getModalVariants(direction);

  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    supportEmail: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    primaryColor: '',
    secondaryColor: '',
    backgroundColor: '',
    textColor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar la configuración actual al abrir el modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getSettings()
      .then((data) => {
        setSettings({
          siteTitle: data.siteTitle || '',
          siteDescription: data.siteDescription || '',
          supportEmail: data.supportEmail || '',
          facebookUrl: data.facebookUrl || '',
          twitterUrl: data.twitterUrl || '',
          instagramUrl: data.instagramUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          primaryColor: data.primaryColor || '',
          secondaryColor: data.secondaryColor || '',
          backgroundColor: data.backgroundColor || '',
          textColor: data.textColor || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || t('adminSettingsModal.errorLoad');
        setError(errMsg);
        setLoading(false);
        toast.error(errMsg);
      });
  }, [isOpen, t]);

  const handleInputChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(settings)
      .then(() => {
        toast.success(t('adminSettingsModal.toast.updateSuccess'));
        onClose();
      })
      .catch((err) => {
        console.error('Error updating settings:', err);
        toast.error(t('adminSettingsModal.toast.updateError'));
      });
  };

  const handleOverlayClick = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) return;
    onClose();
  };

  // Inline styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2100,
    transition: 'background 0.3s ease'
  };

  const modalContentStyle = {
    position: 'relative',
    borderRadius: 20,
    width: '90%',
    maxWidth: 800,
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const headerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: '#f7f7f7'
  };

  const headerButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#333',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, color 0.3s ease'
  };

  const bodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem'
  };

  const rightModalStyle = {
    width: '100%',
    padding: '1rem 1.5rem 2rem 1.5rem'
  };

  // Calcula número de columnas dinámicamente (1: mobile, 2: tablet, 3: desktop)
  const columns = window.innerWidth >= 992 ? 3 : window.innerWidth >= 600 ? 2 : 1;
  const areaFieldsStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem'
  };

  // Imagen: seleccionar patrón según window width
  const imageSrc = window.innerWidth < 768 ? '/images/patronDos.png' : '/images/patronUno.png';

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            style={modalContentStyle}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={headerStyle}>
              <button style={headerButtonStyle} onClick={onClose}>
                <FaArrowLeft />
              </button>
              <button style={headerButtonStyle} onClick={onClose}>
                <FaTimes />
              </button>
            </div>
            <div style={bodyStyle}>
              <h2>{t('adminSettingsModal.title')}</h2>
              {loading ? (
                <p>{t('adminSettingsModal.loading')}</p>
              ) : (
                <form className="settings-form" onSubmit={handleSubmit}>
                  <h3>{t('adminSettingsModal.formTitle')}</h3>
                  {error && <p className="error">{error}</p>}

                  {/* Área: Información del Sitio */}
                  <div className="form-area">
                    <h4 className="area-title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {t('adminSettingsModal.siteInfoTitle', 'Site Information')}
                    </h4>
                    <div className="area-fields" style={areaFieldsStyle}>
                      <div className="form-group">
                        <label htmlFor="siteTitle">{t('adminSettingsModal.siteTitleLabel')}</label>
                        <input
                          id="siteTitle"
                          name="siteTitle"
                          type="text"
                          placeholder={t('adminSettingsModal.siteTitlePlaceholder')}
                          value={settings.siteTitle}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="siteDescription">{t('adminSettingsModal.siteDescriptionLabel')}</label>
                        <input
                          id="siteDescription"
                          name="siteDescription"
                          type="text"
                          placeholder={t('adminSettingsModal.siteDescriptionPlaceholder')}
                          value={settings.siteDescription}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Área: Información de Contacto */}
                  <div className="form-area">
                    <h4 className="area-title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {t('adminSettingsModal.contactInfoTitle', 'Contact Information')}
                    </h4>
                    <div className="area-fields" style={areaFieldsStyle}>
                      <div className="form-group">
                        <label htmlFor="supportEmail">{t('adminSettingsModal.supportEmailLabel')}</label>
                        <input
                          id="supportEmail"
                          name="supportEmail"
                          type="email"
                          placeholder={t('adminSettingsModal.supportEmailPlaceholder')}
                          value={settings.supportEmail}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Área: Redes Sociales */}
                  <div className="form-area">
                    <h4 className="area-title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {t('adminSettingsModal.socialLinksTitle', 'Social Links')}
                    </h4>
                    <div className="area-fields" style={areaFieldsStyle}>
                      <div className="form-group">
                        <label htmlFor="facebookUrl">{t('adminSettingsModal.facebookUrlLabel')}</label>
                        <input
                          id="facebookUrl"
                          name="facebookUrl"
                          type="url"
                          placeholder={t('adminSettingsModal.facebookUrlPlaceholder')}
                          value={settings.facebookUrl}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="twitterUrl">{t('adminSettingsModal.twitterUrlLabel')}</label>
                        <input
                          id="twitterUrl"
                          name="twitterUrl"
                          type="url"
                          placeholder={t('adminSettingsModal.twitterUrlPlaceholder')}
                          value={settings.twitterUrl}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="instagramUrl">{t('adminSettingsModal.instagramUrlLabel')}</label>
                        <input
                          id="instagramUrl"
                          name="instagramUrl"
                          type="url"
                          placeholder={t('adminSettingsModal.instagramUrlPlaceholder')}
                          value={settings.instagramUrl}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="linkedinUrl">{t('adminSettingsModal.linkedinUrlLabel')}</label>
                        <input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          type="url"
                          placeholder={t('adminSettingsModal.linkedinUrlPlaceholder')}
                          value={settings.linkedinUrl}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Área: Colores del Tema */}
                  <div className="form-area">
                    <h4 className="area-title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {t('adminSettingsModal.themeTitle', 'Theme Colors')}
                    </h4>
                    <div className="area-fields" style={areaFieldsStyle}>
                      <div className="form-group">
                        <label htmlFor="primaryColor">{t('adminSettingsModal.primaryColorLabel')}</label>
                        <input
                          id="primaryColor"
                          name="primaryColor"
                          type="text"
                          placeholder={t('adminSettingsModal.primaryColorPlaceholder')}
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="secondaryColor">{t('adminSettingsModal.secondaryColorLabel')}</label>
                        <input
                          id="secondaryColor"
                          name="secondaryColor"
                          type="text"
                          placeholder={t('adminSettingsModal.secondaryColorPlaceholder')}
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="backgroundColor">{t('adminSettingsModal.backgroundColorLabel')}</label>
                        <input
                          id="backgroundColor"
                          name="backgroundColor"
                          type="text"
                          placeholder={t('adminSettingsModal.backgroundColorPlaceholder')}
                          value={settings.backgroundColor}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="textColor">{t('adminSettingsModal.textColorLabel')}</label>
                        <input
                          id="textColor"
                          name="textColor"
                          type="text"
                          placeholder={t('adminSettingsModal.textColorPlaceholder')}
                          value={settings.textColor}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '25px',
                      background: 'linear-gradient(90deg, #007bff 0%, #00aaff 100%)',
                      color: '#fff',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease, transform 0.3s ease'
                    }}
                  >
                    {t('adminSettingsModal.submitButton')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminSettingsModal;
