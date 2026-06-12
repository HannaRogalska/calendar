import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

const API_URL = isLocal ? 'http://localhost:3000/api' : 'https://calendar-eesh.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
});
