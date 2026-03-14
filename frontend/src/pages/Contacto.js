// Contacto.js — Layout original a la derecha con dropdown mejorado
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { enviarMensajeContacto } from '../services/contactoService.js';
import { listServicios } from '../services/servicioService.js';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';

const Contacto = () => {
  const { t } = useTranslation();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [servicioInteres, setServicioInteres] = useState('');
  const [servicios, setServicios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    listServicios()
      .then(data => setServicios(data.servicios || data))
      .catch(() => toast.error('Error al cargar los servicios'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!servicioInteres) {
      toast.error(t('contacto.selectService'));
      return;
    }
    setIsLoading(true);
    enviarMensajeContacto({ nombreCompleto, email, mensaje, servicioInteres })
      .then(() => {
        toast.success('¡Mensaje enviado con éxito!');
        setNombreCompleto(''); setEmail(''); setMensaje(''); setServicioInteres('');
      })
      .catch(() => toast.error('Error al enviar el mensaje'))
      .finally(() => setIsLoading(false));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="page contacto-page"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      variants={containerVariants}
    >
      <div className="contacto-container">
        <h3>{t('contacto.title')}</h3>

        <motion.form onSubmit={handleSubmit} variants={containerVariants}>

          <div className="form-group">
            <label>{t('contacto.fullName')}</label>
            <input
              type="text" required
              value={nombreCompleto}
              onChange={e => setNombreCompleto(e.target.value)}
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>{t('contacto.emailLabel')}</label>
            <input
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          {/* Custom dropdown servicios */}
          <div className="custom-select-group" ref={dropdownRef}>
            <label>{t('contacto.interestedService')}</label>
            <div
              className={`custom-select ${isDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="select-trigger">
                <span className={!servicioInteres ? 'placeholder' : ''}>
                  {servicioInteres
                    ? (servicioInteres.includes('.') ? t(servicioInteres) : servicioInteres)
                    : t('contacto.selectService')}
                </span>
                <FaChevronDown className={`dropdown-icon ${isDropdownOpen ? 'rotated' : ''}`} />
              </div>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="select-options"
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{ originY: 0 }}
                  >
                    <div
                      className={`select-option ${!servicioInteres ? 'selected' : ''}`}
                      onClick={() => { setServicioInteres(''); setIsDropdownOpen(false); }}
                    >
                      {t('contacto.selectService')}
                    </div>
                    {servicios.map(s => (
                      <div
                        key={s.idServicio}
                        className={`select-option ${servicioInteres === s.nombre ? 'selected' : ''}`}
                        onClick={e => { e.stopPropagation(); setServicioInteres(s.nombre); setIsDropdownOpen(false); }}
                      >
                        {s.nombre?.includes('.') ? t(s.nombre) : s.nombre}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="form-group">
            <label>{t('contacto.message')}</label>
            <textarea
              rows="4" required
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              placeholder="Contame en qué te puedo ayudar..."
            />
          </div>

          <motion.button
            type="submit"
            className="submit-btn"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            {isLoading ? <span className="loader" /> : t('contacto.send')}
          </motion.button>

        </motion.form>
      </div>
    </motion.div>
  );
};

export default Contacto;