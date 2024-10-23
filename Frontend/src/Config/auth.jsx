// utils/auth.js
export const isLoggedIn = () => {
    return !!localStorage.getItem('token');  // Check if token is in localStorage
  };
  
  export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {}; // Ensure token is prefixed with 'Bearer '
  };