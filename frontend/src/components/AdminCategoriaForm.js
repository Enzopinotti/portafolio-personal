// src/components/AdminCategoriaForm.jsx
import React from 'react';

const AdminCategoriaForm = ({ newCategoria, setNewCategoria, handleCreate }) => {
  return (
    <form className="new-categoria-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">Crear nueva Categoría</h3>
      <label htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        type="text"
        placeholder="Nombre de la categoría"
        value={newCategoria.nombre || ''}
        onChange={(e) =>
          setNewCategoria({ ...newCategoria, nombre: e.target.value })
        }
      />
      <button type="submit">Crear Categoría</button>
    </form>
  );
};

export default AdminCategoriaForm;
