// API configuration
// Determine the API URL based on the environment
const getApiUrl = () => {
  // For local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // For production deployment - this will need to be updated with your actual backend URL
  // For now, we'll use a placeholder that you'll need to update after deployment
  return 'https://ai-resume-screener-backend.onrender.com';
};

export const API_URL = getApiUrl();

// For debugging purposes
console.log('API URL configured as:', API_URL);

// Endpoints
export const ENDPOINTS = {
  UPLOAD_RESUME: `${API_URL}/upload_resume/`,
};
