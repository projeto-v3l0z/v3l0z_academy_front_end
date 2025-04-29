import apiClient from './apiClient';

const AuthService = {
  login: async ({ email, password }) => {
    const response = await apiClient.post("/accounts/auth/login/", { email, password });
    const { access, refresh, user } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user)); // 🔥 Salva o usuário também!

    apiClient.defaults.headers.Authorization = `Bearer ${access}`;

    return {
      token: access,
      user,
    };
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user"); // 🔥 Remove o user também
    window.location.href = "/sign-in";
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/accounts/auth/profile/');
    return data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('Sem refresh token');

    const { data } = await apiClient.post('/accounts/auth/refresh/', { refresh: refresh });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },
};

export default AuthService;
