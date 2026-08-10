import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Button } from 'react-bootstrap';
import { logout } from '../store/slices/authSlice';
import { initializeSocket, disconnectSocket } from '../socket/socket';
import Chat from './Chat';

const Home = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      initializeSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      <Chat />
    </Container>
  );
};

export default Home;