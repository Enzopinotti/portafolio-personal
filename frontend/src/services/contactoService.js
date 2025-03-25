const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const enviarMensajeContacto = async (mensajeData) => {
  const response = await fetch(`${API_URL}/mensaje-contacto/enviar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mensajeData),
  });

  if (!response.ok) {
    throw await response.json();
  }

  return response.json();
};
