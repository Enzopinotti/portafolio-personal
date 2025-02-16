// src/components/LanguageSwitcher.js
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'es', label: 'Es', flag: 'AR' },
  { code: 'en', label: 'En', flag: 'US' },
  { code: 'pt', label: 'Pt', flag: 'BR' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); // Obtén la instancia
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  // Cerrar el dropdown al hacer clic fuera
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];
  const otherLanguages = languages.filter((l) => l.code !== i18n.language);

  return (
    <div className="language-switcher" ref={ref}>
      <button className="current-lang" onClick={toggleOpen}>
        <ReactCountryFlag
          countryCode={current.flag}
          svg
          style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
        />
        {current.label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="lang-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {otherLanguages.map((lang) => (
              <li key={lang.code} onClick={() => switchLanguage(lang.code)}>
                <ReactCountryFlag
                  countryCode={lang.flag}
                  svg
                  style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
                />
                {lang.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
