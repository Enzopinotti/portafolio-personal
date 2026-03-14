// frontend/src/services/noticiaService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getLatestNoticias = async (limit = 6) => {
  const response = await axios.get(`${API_URL}/noticias?limit=${limit}`);
  return response.data;
};
