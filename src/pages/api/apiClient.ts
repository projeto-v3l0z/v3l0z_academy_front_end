// services/apiClient.ts
import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
  } from 'axios';
  import { parse } from 'cookie';
  import { IncomingMessage } from 'http';
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  export const ApiClient = (req?: IncomingMessage): AxiosInstance => {
    let token: string | undefined;
  
    if (req?.headers?.cookie) {
      const cookies = parse(req.headers.cookie);
      token = cookies.access_token;
    }
  
    const apiClient = axios.create({
      baseURL: API_BASE_URL,
    });
  
    apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );
  
    return apiClient;
  };
  