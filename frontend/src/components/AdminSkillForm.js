import React from 'react';

const AdminSkillForm = ({ newSkill, setNewSkill, handleCreate, availableCategories }) => {
  const handleCategoryChange = (e) => {
    setNewSkill({ ...newSkill, idCategoriaSkill: e.target.value });
  };

  const handleNivelChange = (e) => {
    setNewSkill({ ...newSkill, nivel: e.target.value });
  };

  return (
    <form className="new-skill-form" onSubmit={handleCreate}>
      <h3 className="titulo-form">Crear nueva Skill</h3>
      
      <label htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        type="text"
        placeholder="Nombre de la skill"
        value={newSkill.nombre || ''}
        onChange={(e) =>
          setNewSkill({ ...newSkill, nombre: e.target.value })
        }
      />
      
      <label htmlFor="nivel">
        Nivel: {newSkill.nivel ? newSkill.nivel : 0}%
      </label>
      <input
        id="nivel"
        type="range"
        min="0"
        max="100"
        value={newSkill.nivel || 0}
        onChange={handleNivelChange}
      />
      
      <label htmlFor="categoria">Categoría</label>
      <select
        id="categoria"
        value={newSkill.idCategoriaSkill || ''}
        onChange={handleCategoryChange}
      >
        <option value="">Seleccione una categoría</option>
        {availableCategories &&
          availableCategories.map((cat) => (
            <option key={cat.idCategoriaSkill} value={cat.idCategoriaSkill}>
              {cat.nombre}
            </option>
          ))}
      </select>
      
      <button type="submit">Crear Skill</button>
    </form>
  );
};

export default AdminSkillForm;
