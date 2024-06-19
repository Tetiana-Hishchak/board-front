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

export const updateBoard = async (boardId, name) => {
  const response = await axios.put(`${API_URL}/boards/${boardId}`, { name });
  return response.data;
};

export const deleteBoard = async (boardId) => {
  await axios.delete(`${API_URL}/boards/${boardId}`);
};

export const addCard = async (boardId, title, description) => {
  const response = await axios.post(`${API_URL}/boards/${boardId}/cards`, { title, description });
  return response.data;
};

export const moveCard = async (boardId, cardId, destinationColumnId) => {
  const response = await axios.put(`${API_URL}/boards/${boardId}/cards/${cardId}/move`, { destinationColumnId });
  return response.data;
};

export const updateCard = async (boardId, cardId, updates) => {
  const response = await axios.patch(`${API_URL}/boards/${boardId}/cards/${cardId}`, {...updates });
  return response.data;
};

export const deleteCard = async (boardId, cardId) => {
  await axios.delete(`${API_URL}/boards/${boardId}/cards/${cardId}`);
};