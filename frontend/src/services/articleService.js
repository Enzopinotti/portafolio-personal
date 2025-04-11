// src/services/articleService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getArticles = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_URL}/articulos?page=${page}&limit=${limit}`);
  if (!res.ok) throw await res.json();
  return res.json(); // { articulos, total, pages, currentPage }
};
