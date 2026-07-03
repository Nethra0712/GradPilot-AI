import axios from 'axios';

// Centralized Axios instance configured with defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send HTTP cookies (required for Secure httpOnly refresh token strategy)
});

/**
 * Request interceptor to attach bearer access tokens to outgoing HTTP calls.
 */
api.interceptors.request.use(
  (config) => {
    // FUTURE JWT strategy: Retrieve short-lived access token from client memory (or state manager)
    // const token = getAccessTokenFromMemory();
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to catch authentication issues and automate Token Refresh flow.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Catch 401 Unauthorized (indicates expired or missing access token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // FUTURE JWT Strategy: Trigger token rotation callback
        // The refresh endpoint reads the httpOnly refresh cookie and issues a fresh short-lived access token
        // const refreshResponse = await axios.post(
        //   `${api.defaults.baseURL}/auth/refresh`,
        //   {},
        //   { withCredentials: true }
        // );
        // const newAccessToken = refreshResponse.data.accessToken;
        // setAccessTokenInMemory(newAccessToken);
        //
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return api(originalRequest); // Retry original request with new token
      } catch (refreshError) {
        // If refresh fails, session is entirely dead - trigger global logout / context cleanup
        // triggerSessionExpiryCleanup();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
