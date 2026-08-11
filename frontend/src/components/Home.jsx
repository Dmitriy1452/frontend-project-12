import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { initializeSocket, disconnectSocket } from '../socket/socket';
import Chat from './Chat';
import ErrorBoundary from './ErrorBoundary';

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    if (token && !socketInitialized) {
      const timeoutId = setTimeout(() => {
        initializeSocket(token);
        setSocketInitialized(true);
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
    
    return () => {
      disconnectSocket();
      setSocketInitialized(false);
    };
  }, [token, socketInitialized]);

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      <ErrorBoundary>
        <Chat />
      </ErrorBoundary>
    </Container>
  );
};

export default Home;