import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  timeout: 120000, // 2 minutes for PDF parsing/embedding
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with a status code outside 2xx
      const data = error.response.data;
      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ');
      } else if (data?.message) {
        message = data.message;
      } else {
        message = `Server error (${error.response.status})`;
      }
    } else if (error.request) {
      // Network error / no response received
      message = 'Unable to connect to KnowledgeHub AI backend. Please check your network or server status.';
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

