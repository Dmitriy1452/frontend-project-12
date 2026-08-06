import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card text-center">
            <h1 className="auth-title display-4">Hexlet Chat</h1>
            <p className="text-muted mb-4 fs-5">
              Добро пожаловать в чат-приложение!
            </p>
            <p className="text-muted mb-4">
              Здесь вы можете общаться с друзьями и коллегами в реальном времени.
            </p>
            <Link to="/login">
              <Button 
                variant="primary" 
                size="lg"
                className="auth-btn"
              >
                Войти в чат
              </Button>
            </Link>
            <div className="mt-3">
              <span className="text-muted">Нет аккаунта? </span>
              <Link to="/register" className="auth-link">
                Регистрация
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;