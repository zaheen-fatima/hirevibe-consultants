import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../lib/storage';
import type {ChangePasswordRequest, LoginRequest, LoginResponse, RefreshTokenResponse } from '../types/api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequestConfig | undefined;
    if (error.response?.status !== 401 || !original || original._retry || original.url?.includes('/auth/')) {
      throw error;
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clear();
      throw error;
    }

    original._retry = true;
    refreshPromise ??= refreshAccessToken(refreshToken).finally(() => {
      refreshPromise = null;
    });

    const nextAccessToken = await refreshPromise;
    if (!nextAccessToken) {
      tokenStorage.clear();
      throw error;
    }

    original.headers.Authorization = `Bearer ${nextAccessToken}`;
    return api.request(original);
  },
);

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => (await api.post<LoginResponse>('/auth/login', payload)).data,
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) await api.post('/auth/logout', { refreshToken });
  },
  logoutAll: async (): Promise<void> => {
    await api.post('/auth/logout-all');
  },
    changePassword: async (
        payload: ChangePasswordRequest,
    ): Promise<void> => {
        await api.post('/auth/password', payload);
    },
};

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await axios.post<RefreshTokenResponse>(`${apiBaseUrl}/auth/refresh`, { refreshToken });
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data.accessToken;
  } catch {
    return null;
  }
}
