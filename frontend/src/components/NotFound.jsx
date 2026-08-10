import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          <Card className="text-center shadow-lg" style={{ width: '500px' }}>
            <Card.Body className="py-5">
              <h1 className="display-1 text-primary fw-bold">404</h1>
              <h2 className="mb-3">{t('notFound.title')}</h2>
              <p className="text-muted mb-4">
                {t('notFound.description')}
              </p>
              <Link to="/">
                <Button variant="primary" size="lg" className="px-4">
                  {t('notFound.goHome')}
                </Button>
              </Link>
            </Card.Body>
            <Card.Footer className="text-muted">
              {t('notFound.checkUrl')}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;