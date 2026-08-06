import React from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { logout } from '../store/slices/authSlice';
import Chat from './Chat';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container fluid className="app-container min-vh-100">
      <Row className="h-100">
        <Col>
          <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
            <h4 className="mb-0">Hexlet Chat</h4>
            <Button variant="outline-danger" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
          <Chat />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;