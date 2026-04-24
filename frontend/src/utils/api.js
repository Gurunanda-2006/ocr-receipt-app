import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 150000, // 2.5 min for OCR processing
});

/**
 * Upload a receipt image and get OCR results.
 * @param {File} file - The image file to process.
 * @param {function} onProgress - Progress callback (0-100).
 * @returns {Promise<object>} The processed receipt data.
 */
export const uploadReceipt = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/receipts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return response.data;
};

/**
 * Fetch all processed receipts.
 */
export const getAllReceipts = async () => {
  const response = await api.get('/receipts');
  return response.data;
};

/**
 * Fetch a single receipt by ID.
 */
export const getReceiptById = async (id) => {
  const response = await api.get(`/receipts/${id}`);
  return response.data;
};

/**
 * Delete a receipt by ID.
 */
export const deleteReceipt = async (id) => {
  const response = await api.delete(`/receipts/${id}`);
  return response.data;
};
