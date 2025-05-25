// src/services/apiClient.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 1) Injeta access_token em cada requisição
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// 2) Se receber 401, tenta usar o refresh token
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalReq = error.config;
    const refreshToken = localStorage.getItem('refresh_token');

    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      refreshToken
    ) {
      originalReq._retry = true;
      try {
        // solicita novo access usando o refresh
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh: refreshToken }
        );
        // atualiza tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // repete requisição original com novo token
        originalReq.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalReq);
      } catch (refreshError) {
        // falhou no refresh → limpa e redireciona
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
