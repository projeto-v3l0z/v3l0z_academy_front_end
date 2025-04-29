import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔥 AQUI é a correção
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // 🔥 Pega na hora!
    console.log("🔵 1. Verificando token no localStorage:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh interceptor (mantém o seu)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalReq._retry = true;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh: localStorage.getItem('refresh_token') }
        );
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        originalReq.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalReq);
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
