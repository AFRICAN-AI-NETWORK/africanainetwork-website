import axiosInstance from './axios';
import { storageHandler } from './localStorage';

export const validateAuth = async () => {
  try {
    const token = storageHandler.getToken();
    if (!token) return { isValid: false, user: null, isVerified: false };

    const response = await axiosInstance.get('/auth/profile');
    storageHandler.setUser(response.data);

    return {
      isValid: true,
      user: response.data,
      isVerified: response.data.emailVerified,
    };
  } catch (err: unknown) {
    console.error('Error validating auth', err);
    storageHandler.removeCredentials();
    return { isValid: false, user: null, isVerified: false };
  }
};
