import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    if (error === 'Unauthorized' || error.includes('auth')) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger">
          {typeof error === 'string' ? error : 'Произошла ошибка'}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;