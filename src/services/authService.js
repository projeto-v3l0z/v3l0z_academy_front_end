import apiClient from './apiClient';
import Cookies from 'js-cookie';

const AuthService = {
  login: async ({ email, password }) => {
    const { data } = await apiClient.post('/auth/login/', { email, password });
    Cookies.set('access_token', data.access_token);
    Cookies.set('refresh_token', data.refresh_token);
    return data;
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/login';
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/auth/profile/');
    return data;
  },

  refreshToken: async () => {
    const refresh = Cookies.get('refresh_token');
    if (!refresh) throw new Error('Sem refresh token');
    const { data } = await apiClient.post('/auth/refresh/', { refresh_token: refresh });
    Cookies.set('access_token', data.access_token);
    Cookies.set('refresh_token', data.refresh_token);
    return data;
  },
};

export default AuthService;
