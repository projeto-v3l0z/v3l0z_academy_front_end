import apiClient from './apiClient';
import Cookies from 'js-cookie';

const AuthService = {
  login: async ({ email, password }) => {
    // 1. faz o login e guarda resposta inteira
    const response = await apiClient.post("/accounts/auth/login/", { email, password });
    console.log("🔑 login response:", response.data);

    // 2. salva os tokens no cookie
    Cookies.set("access_token", response.data.access_token);
    Cookies.set("refresh_token", response.data.refresh_token);

    const user = response.data.user;

    console.log("👤 user na response:", user);

    // 4. retorne token e user
    return {
      token: response.data.access_token,
      user,
    };
  },

  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/sign-in";
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/accounts/auth/profile/');
    return data;
  },

  refreshToken: async () => {
    const refresh = Cookies.get('refresh_token');
    if (!refresh) throw new Error('Sem refresh token');
    const { data } = await apiClient.post('/accounts/auth/refresh/', { refresh_token: refresh });
    Cookies.set('access_token', data.access_token);
    Cookies.set('refresh_token', data.refresh_token);
    return data;
  },
};

export default AuthService;
