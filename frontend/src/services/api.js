import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  uploadData: async (formData) => {
    const res = await client.post('/upload-data', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  resetData: async () => {
    const res = await client.post('/reset');
    return res.data;
  },

  getGridData: async () => {
    const res = await client.get('/generate-grid');
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

  // email: logged-in user's email passed as query param for alert routing
  triggerDetection: async (email = null) => {
    const params = email ? { email } : {};
    const res = await client.post('/detect', null, { params });
    return res.data;
  },

  getDetectionResults: async (email = null) => {
    const params = email ? { email } : {};
    const res = await client.get('/detect-theft', { params });
    return res.data;
  },

  detectAnomaly: async (email = null) => {
    const params = email ? { email } : {};
    const res = await client.get('/detect-anomaly', { params });
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
