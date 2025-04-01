import { jwtDecode } from 'jwt-decode';

const AUTH_TOKEN_KEY = 'aan_auth_token';
const USER_KEY = 'aan_user';

export const storageHandler = {
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  setToken(token: string) {
    return localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  setUser(user: object) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data from localStorage', error);
      return null;
    }
  },
  isTokenExpired(): boolean | undefined {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return undefined;

    const decodedToken: { exp: number } = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate > new Date();
  },
  removeCredentials() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
