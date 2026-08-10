import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { login, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.username) {
        errors.username = 'Имя пользователя обязательно';
      } else if (values.username.length < 3) {
        errors.username = 'Имя должно содержать минимум 3 символа';
      }

      if (!values.password) {
        errors.password = 'Пароль обязателен';
      } else if (values.password.length < 6) {
        errors.password = 'Пароль должен содержать минимум 6 символов';
      }

      return errors;
    },
    onSubmit: async (values) => {
      dispatch(clearError());
      const result = await dispatch(login(values));
      
      if (login.fulfilled.match(result)) {
        navigate('/');
      }
    },
  });

  if (isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
            <div className="auth-card text-center">
              <h1 className="auth-title display-6">Hexlet Chat</h1>
              <div className="alert alert-success">
                Вы уже авторизованы!
              </div>
              <Link to="/">
                <Button className="auth-btn">
                  Перейти в чат
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card">
            <h1 className="auth-title display-6">Hexlet Chat</h1>
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {typeof error === 'string' ? error : 'Произошла ошибка авторизации'}
              </Alert>
            )}

            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Имя пользователя</Form.Label>
                <Form.Control
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Введите имя пользователя"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  isInvalid={formik.touched.username && !!formik.errors.username}
                  className="auth-input"
                  disabled={isLoading}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="error-text">{formik.errors.username}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Пароль</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Введите пароль"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  isInvalid={formik.touched.password && !!formik.errors.password}
                  className="auth-input"
                  disabled={isLoading}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error-text">{formik.errors.password}</div>
                )}
              </Form.Group>

              <Button 
                type="submit" 
                className="auth-btn mb-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">Нет аккаунта? </span>
                <Link to="/signup" className="auth-link">
                  Регистрация
                </Link>
              </div>
              
              <div className="text-center mt-3 p-2 bg-light rounded">
                <small className="text-muted d-block">
                  <strong>Тестовый вход:</strong> admin / admin
                </small>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;