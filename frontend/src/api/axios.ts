import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

const API_URL = isLocal ? 'http://localhost:3000' : 'https://calendar-eesh.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});
