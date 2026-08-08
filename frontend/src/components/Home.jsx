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
      {/* Шапка - белая */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ backgroundColor: '#ffffff' }}>
        <h4 className="mb-0 text-primary">Hexlet Chat</h4>
        <Button variant="outline-danger" onClick={handleLogout}>
          Выйти
        </Button>
      </div>

      {/* Чат */}
      <Chat />
    </Container>
  );
};

export default Home;