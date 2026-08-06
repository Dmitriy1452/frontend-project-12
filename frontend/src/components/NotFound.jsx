import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card text-center">
            <div className="notfound-icon">🔍</div>
            <h1 className="notfound-title">404</h1>
            <h2 className="mb-3">Страница не найдена</h2>
            <p className="text-muted mb-4">
              Извините, запрошенная страница не существует.
              <br />
              Проверьте правильность URL-адреса.
            </p>
            <Link to="/">
              <Button 
                variant="primary" 
                size="lg"
                className="auth-btn"
              >
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;