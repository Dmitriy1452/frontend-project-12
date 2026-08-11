import React from 'react';
import { ErrorBoundary as RollbarErrorBoundary } from '@rollbar/react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const FallbackUI = ({ error, resetError }) => (
  <Container className="d-flex justify-content-center align-items-center min-vh-100">
    <Row>
      <Col xs={12} md={8} lg={6} className="mx-auto">
        <div className="auth-card text-center">
          <h1 className="auth-title display-6">Что-то пошло не так</h1>
          <p className="text-muted mb-4">
            Произошла ошибка в приложении. Мы уже уведомлены об этом.
          </p>
          {error && (
            <div className="alert alert-danger text-start">
              <strong>Ошибка:</strong> {error.toString()}
            </div>
          )}
          <Button 
            variant="primary" 
            onClick={resetError}
            className="auth-btn"
          >
            Попробовать снова
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
);

const ErrorBoundary = ({ children }) => {
  return (
    <RollbarErrorBoundary 
      fallbackUI={FallbackUI}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      {children}
    </RollbarErrorBoundary>
  );
};

export default ErrorBoundary;