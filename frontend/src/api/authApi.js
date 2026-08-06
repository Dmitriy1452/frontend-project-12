import axios from 'axios';

const api = axios.create({
  baseURL: 'https://frontend-chat-ru.hexlet.app/api',
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
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  if (credentials.username === 'admin' && credentials.password === 'admin') {
    return {
      data: {
        token: 'test-jwt-token-123456',
        username: 'admin',
      },
    };
  }
  
  throw new Error('Неверное имя пользователя или пароль');
};

export default api;