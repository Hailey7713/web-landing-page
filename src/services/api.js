import axios from 'axios';

// Create an axios instance with the base URL of our backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contact API
export const contactAPI = {
  // Send contact form data
  sendMessage: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },
};

export default api;
