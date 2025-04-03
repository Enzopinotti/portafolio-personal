// src/components/ServiceActionsDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const ServiceActionsDropdown = ({
  onEdit,    // Función para editar el servicio
  onDelete,  // Función para eliminar el servicio
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="service-actions-dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        <FaEllipsisV />
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => { onEdit(); setIsOpen(false); }}>
            Editar Servicio
          </li>
          <li className="danger" onClick={() => { onDelete(); setIsOpen(false); }}>
            Eliminar Servicio
          </li>
        </ul>
      )}
    </div>
  );
};

export default ServiceActionsDropdown;
