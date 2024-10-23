export const isLoggedIn = () => {
  return !!sessionStorage.getItem('token');  
};

export const getAuthHeader = () => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {}; 
};
