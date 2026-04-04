import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  getGridData: async (city = "Delhi") => {
    const res = await client.get(`/generate-grid?city=${city}`);
    return res.data;
  },
  getMetrics: async () => {
    const res = await client.get('/metrics');
    return res.data;
  },
  getAlerts: async () => {
    const res = await client.get('/alerts');
    return res.data;
  },
  triggerDetection: async () => {
    const res = await client.post('/detect');
    return res.data;
  },
  getDetectionResults: async () => {
    const res = await client.get('/detect-theft');
    return res.data;
  },
  injectTheft: async (poleIds) => {
    const res = await client.post('/inject-theft', { poles: poleIds });
    return res.data;
  },
  getHistory: async () => {
    const res = await client.get('/history');
    return res.data;
  }
};
