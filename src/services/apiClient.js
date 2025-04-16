import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Injeta o token em todo request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatiza refresh de token em 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      Cookies.get('refresh_token')
    ) {
      originalReq._retry = true;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh_token: Cookies.get('refresh_token') }
        );
        Cookies.set('access_token', data.access_token);
        Cookies.set('refresh_token', data.refresh_token);
        originalReq.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalReq);
      } catch (e) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
