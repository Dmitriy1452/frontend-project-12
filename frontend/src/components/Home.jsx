import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { initializeSocket, disconnectSocket } from '../socket/socket';
import Chat from './Chat';
import ErrorBoundary from './ErrorBoundary';

const Home = ({ socket: providedSocket }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!providedSocket && isAuthenticated && token) {
      initializeSocket(token);
    }

    return () => {
      if (!providedSocket && isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [providedSocket, isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container fluid className="p-0 chat-fix">
      <ErrorBoundary>
        <Chat socket={providedSocket} />
      </ErrorBoundary>
    </Container>
  );
};

export default Home;