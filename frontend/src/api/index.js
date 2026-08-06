import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  signup: (userData) => api.post('/signup', userData),
};

export const channelsAPI = {
  getAll: () => api.get('/channels'),
  create: (data) => api.post('/channels', data),
  update: (id, data) => api.patch(`/channels/${id}`, data),
  delete: (id) => api.delete(`/channels/${id}`),
};

export const messagesAPI = {
  getAll: () => api.get('/messages'),
  create: (data) => api.post('/messages', data),
  update: (id, data) => api.patch(`/messages/${id}`, data),
  delete: (id) => api.delete(`/messages/${id}`),
};

export default api;