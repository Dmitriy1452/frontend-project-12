import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { login, clearError } from '../store/slices/authSlice';
import useToast from '../hooks/useToast';

const Login = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.username) {
        errors.username = t('errors.usernameRequired');
      } else if (values.username.length < 3) {
        errors.username = t('errors.usernameMin');
      }

      if (!values.password) {
        errors.password = t('errors.passwordRequired');
      } else if (values.password.length < 6) {
        errors.password = t('errors.passwordMin');
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      dispatch(clearError());
      
      const actionResult = await dispatch(login(values));
      
      if (login.fulfilled.match(actionResult)) {
        const user = actionResult.payload;
        showSuccess(t('auth.loginSuccess', { username: user.username }));
        navigate('/', { replace: true });
      } else if (login.rejected.match(actionResult)) {
        const errorMessage = actionResult.payload || t('auth.loginError');
        showError(errorMessage);
        setFieldError('password', errorMessage);
        setSubmitting(false);
      }
    },
  });

  if (isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
            <div className="auth-card text-center">
              <h1 className="auth-title display-6">{t('app.title')}</h1>
              <div className="alert alert-success">
                {t('auth.loginSuccess', { username: 'пользователь' })}
              </div>
              <Link to="/">
                <Button className="auth-btn">
                  {t('app.login')}
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
            <h1 className="auth-title display-6">{t('app.title')}</h1>
            
            {error && !formik.errors.password && (
              <Alert variant="danger" className="mb-3">
                {typeof error === 'string' ? error : t('auth.loginError')}
              </Alert>
            )}

            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="username" className="fw-semibold">Ваш ник</Form.Label>
                <Form.Control
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Ваш ник"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  isInvalid={formik.touched.username && !!formik.errors.username}
                  className="auth-input"
                  disabled={isLoading || formik.isSubmitting}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="error-text">{formik.errors.username}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="password" className="fw-semibold">Пароль</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  isInvalid={formik.touched.password && !!formik.errors.password}
                  className="auth-input"
                  disabled={isLoading || formik.isSubmitting}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error-text">{formik.errors.password}</div>
                )}
              </Form.Group>

              <Button 
                type="submit" 
                className="auth-btn mb-3"
                disabled={isLoading || formik.isSubmitting || !formik.values.username || !formik.values.password}
              >
                {(isLoading || formik.isSubmitting) ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {t('auth.loginButton')}...
                  </>
                ) : (
                  t('auth.loginButton')
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">{t('auth.noAccount')} </span>
                <Link to="/signup" className="auth-link">
                  {t('app.signup')}
                </Link>
              </div>

            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;