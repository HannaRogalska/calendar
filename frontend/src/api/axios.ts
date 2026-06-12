import axios from 'axios';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : window.location.hostname.includes('vercel.app')
      ? 'https://calendar-eesh.onrender.com'
      : 'https://calendar-eesh.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});
