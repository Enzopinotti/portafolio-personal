// src/components/layouts/Footer.js
import React from 'react';
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import '../../styles/layouts/_footer.scss';

const Footer = () => {
  return (
    <div className="footer">
      <div className="copyright">
        <p>© Enzo Pinotti - Todos los derechos reservados</p>
      </div>
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn size={24} />
        </a>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp size={24} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
