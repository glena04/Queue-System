import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000', // Set correct backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      const { status } = error.response;
      
      // Handle unauthorized errors
      if (status === 401) {
        // Redirect to login or refresh token
        console.error('Unauthorized access. Please login again.');
      }
      
      // Handle forbidden errors
      if (status === 403) {
        console.error('Access forbidden. You do not have permission for this action.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;