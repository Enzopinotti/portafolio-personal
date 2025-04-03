import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const ProjectActionsDropdown = ({
  onAssignSkills,
  onAssignServices,
  onEdit,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="project-actions-dropdown" ref={dropdownRef}>
      <button className="dropdown-btn" onClick={toggleDropdown}>
        <FaEllipsisV />
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => { onAssignSkills(); setIsOpen(false); }}>Asignar Skill</li>
          <li onClick={() => { onAssignServices(); setIsOpen(false); }}>Asignar Servicios</li>
          <li onClick={() => { onEdit(); setIsOpen(false); }}>Editar Proyecto</li>
          <li className="danger" onClick={() => { onDelete(); setIsOpen(false); }}>Eliminar Proyecto</li>
        </ul>
      )}
    </div>
  );
};

export default ProjectActionsDropdown;
