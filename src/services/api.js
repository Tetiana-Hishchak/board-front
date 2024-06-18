import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API;

export const getBoards = async () => {
  const response = await axios.get(`${API_URL}/boards`);
  return response.data;
};

export const getBoardById = async (id) => {
  const response = await axios.get(`${API_URL}/boards/${id}`);
  return response.data;
};

export const createBoard = async (name) => {
  const response = await axios.post(`${API_URL}/boards`, { name });
  return response.data;
};

export const addCard = async (title, description) => {
  const response = await axios.post(`${API_URL}/cards`, { title, description });
  return response.data;
};

export const moveCard = async (id, column) => {
  const response = await axios.put(`${API_URL}/cards/${id}/column`, { column });
  return response.data;
};

export const getCards = async (boardId) => {
  const response = await axios.get(`${API_URL}/cards`, { params: { boardId } });
  return response.data;
};

export const updateCard = async (cardId, updates) => {
  const response = await axios.put(`${API_URL}/cards/${cardId}`, {...updates });
  return response.data;
};

export const deleteCard = async (cardId) => {
  await axios.delete(`${API_URL}/cards/${cardId}`);
};