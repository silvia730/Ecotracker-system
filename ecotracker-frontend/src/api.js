import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL ,  // You can add more default config here (headers, etc.)
});

export default api; 
