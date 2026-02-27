// Contacto.js (completo mejorado)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { enviarMensajeContacto } from '../services/contactoService.js';
import { listServicios } from '../services/servicioService.js';
import { useTranslation } from 'react-i18next';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.5, ease: 'easeInOut' }
  }
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const Contacto = () => {
  const { t } = useTranslation();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [servicioInteres, setServicioInteres] = useState('');
  const [servicios, setServicios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    listServicios()
      .then(data => setServicios(data.servicios || data))
      .catch(err => toast.error('Error al cargar los servicios'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    enviarMensajeContacto({ nombreCompleto, email, mensaje, servicioInteres })
      .then(() => {
        toast.success('Mensaje enviado con éxito');
        setNombreCompleto('');
        setEmail('');
        setMensaje('');
        setServicioInteres('');
      })
      .catch(() => toast.error('Error al enviar el mensaje'))
      .finally(() => setIsLoading(false));
  };

  return (
    <motion.div
      className="page contacto-page"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
    >
      <div className="contacto-container">
        <div className="contacto-right">
          <div className="contacto-info">
            <h2>{t('contacto.title')}</h2>
            <p>{t('contacto.email')} <a href="mailto:enzopinottii@gmail.com">enzopinottii@gmail.com</a></p>
            <p>{t('contacto.phone')} <a className='telefonoContacto' href="tel:+542346304036">+54 2346 304036</a></p>
            <p className='direccion'>{t('contacto.address')}</p>
          </div>

          <div className="contacto-form">
            <h3>{t('contacto.sendMessage')}</h3>
            <motion.form onSubmit={handleSubmit} variants={formVariants}>
              <motion.div className="form-group" variants={inputVariants}>
                <label htmlFor="nombre">{t('contacto.fullName')}</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  autoComplete="name"
                />
              </motion.div>

              <motion.div className="form-group" variants={inputVariants}>
                <label htmlFor="email">{t('contacto.emailLabel')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </motion.div>

              <motion.div className="form-group" variants={inputVariants}>
                <label htmlFor="servicio">{t('contacto.interestedService')}</label>
                <select
                  id="servicio"
                  required
                  value={servicioInteres}
                  onChange={(e) => setServicioInteres(e.target.value)}
                >
                  <option value="">{t('contacto.selectService')}</option>
                  {servicios.map(servicio => (
                    <option key={servicio.idServicio} value={servicio.nombre}>{servicio.nombre}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div className="form-group" variants={inputVariants}>
                <label htmlFor="mensaje">{t('contacto.message')}</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="5"
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                ></textarea>
              </motion.div>

              <motion.button type="submit" variants={buttonVariants} disabled={isLoading}>
                {isLoading ? <span className="loader"></span> : t('contacto.send')}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contacto;