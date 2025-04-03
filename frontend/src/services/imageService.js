const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Traer todas las imágenes asociadas a un proyecto.
 * @param {number|string} idProyecto
 */
export const getImagenesByProyecto = async (idProyecto) => {
  const response = await fetch(`${API_URL}/imagenes/proyecto/${idProyecto}`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json(); 
};
