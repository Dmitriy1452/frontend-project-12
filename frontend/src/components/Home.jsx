import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { logout } from '../store/slices/authSlice';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card text-center">
            <h1 className="auth-title display-4">Hexlet Chat</h1>
            <p className="text-muted mb-4 fs-5">
              Добро пожаловать в чат-приложение!
            </p>
            <div className="alert alert-success">
              Вы успешно авторизованы!
            </div>
            <p className="text-muted mb-4">
              Здесь будет чат. Страница временно защищена.
            </p>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="mb-3"
              style={{
                borderRadius: '12px',
                padding: '10px 30px',
                fontWeight: '600'
              }}
            >
              Выйти
            </Button>
            <div className="mt-3">
              <Link to="/login" className="auth-link">
                ← На страницу входа
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;