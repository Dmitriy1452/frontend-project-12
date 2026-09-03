import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { initializeSocket, disconnectSocket } from '../socket/socket';
import Chat from './Chat';
import ErrorBoundary from './ErrorBoundary';

const Home = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token && !socketInitialized) {
      try {
        initializeSocket(token);
        setSocketInitialized(true);
      } catch (error) {
      }
    }
    
    return () => {
      if (socketInitialized) {
        disconnectSocket();
        setSocketInitialized(false);
      }
    };
  }, [isAuthenticated, token, socketInitialized]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      <ErrorBoundary>
        <Chat />
      </ErrorBoundary>
    </Container>
  );
};

export default Home;