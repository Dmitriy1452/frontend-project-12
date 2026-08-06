import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { isAuthenticated, token, isLoading, error } = useSelector((state) => state.auth);
  
  return {
    isAuthenticated,
    token,
    isLoading,
    error,
  };
};

export default useAuth;