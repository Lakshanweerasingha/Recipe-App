export const isLoggedIn = () => {
  return !!sessionStorage.getItem('token');  // Check if token is in sessionStorage
};

export const getAuthHeader = () => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {}; // Ensure token is prefixed with 'Bearer '
};
