const ACCESS_TOKEN_KEY = 'hirevibe.accessToken';
const REFRESH_TOKEN_KEY = 'hirevibe.refreshToken';
const USER_KEY = 'hirevibe.user';

export type StoredUser = {
  userId: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};

export const tokenStorage = {
  getAccessToken: (): string | null => sessionStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: (): StoredUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },
  setSession: (user: StoredUser, accessToken: string, refreshToken: string): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
