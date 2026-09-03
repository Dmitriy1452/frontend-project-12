import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { initializeSocket, disconnectSocket } from '../socket/socket';
import Chat from './Chat';
import ErrorBoundary from './ErrorBoundary';

const Home = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return undefined;
    }

    const socket = initializeSocket(token);

    const handleConnect = () => {
      setSocketInitialized(true);
    };

    if (socket?.connected) {
      setSocketInitialized(true);
    } else {
      socket?.once('connect', handleConnect);
    }

    return () => {
      socket?.off('connect', handleConnect);
      disconnectSocket();
      setSocketInitialized(false);
    };
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!socketInitialized) {
    return (
      <Container fluid className="p-0 chat-fix">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border" role="status" />
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0 chat-fix">
      <ErrorBoundary>
        <Chat />
      </ErrorBoundary>
    </Container>
  );
};

export default Home;