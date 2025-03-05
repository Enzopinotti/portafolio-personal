// src/components/AdminServicioForm.js
import React from 'react';

const AdminServicioForm = ({ newServicio, setNewServicio, handleCreate }) => {
  const handleInputChange = (e) => {
    setNewServicio({
      ...newServicio,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="new-project-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">Crear nuevo Servicio</h3>
      <label htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        placeholder="Nombre del servicio"
        value={newServicio.nombre || ''}
        onChange={handleInputChange}
      />
      <label htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        name="descripcion"
        placeholder="Descripción del servicio"
        value={newServicio.descripcion || ''}
        onChange={handleInputChange}
      />
      <label htmlFor="precio">Precio</label>
      <input
        id="precio"
        name="precio"
        type="number"
        step="0.01"
        placeholder="Precio"
        value={newServicio.precio || ''}
        onChange={handleInputChange}
      />
      <button type="submit">Crear Servicio</button>
    </form>
  );
};

export default AdminServicioForm;
