import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

interface CookieOptions {
  expires?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const getDefaultOptions = (): CookieOptions => ({
  expires: 7, // 7 days
  secure: import.meta.env.PROD,
  sameSite: 'lax'
});

export const setAuthToken = (token: string): void => {
  Cookies.set(AUTH_TOKEN_KEY, token, getDefaultOptions());
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    ...getDefaultOptions(),
    expires: 30 // 30 days for refresh token
  });
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setUserInfo = (userInfo: object): void => {
  Cookies.set(USER_INFO_KEY, JSON.stringify(userInfo), getDefaultOptions());
};

export const getUserInfo = (): object | null => {
  const userInfo = Cookies.get(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

export const clearAuthCookies = (): void => {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_INFO_KEY);
}; 
