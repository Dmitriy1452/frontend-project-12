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
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    dispatch(clearError());
    
    try {
      const result = await dispatch(login({
        username: values.username,
        password: values.password,
      })).unwrap();
      
      if (result) {
        showSuccess(t('auth.loginSuccess', { username: result.username }));
        navigate('/', { replace: true });
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : t('auth.loginError');
      setFieldError('username', errorMessage);
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleSubmit,
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
            
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="username" className="fw-semibold">{t('auth.username')}</Form.Label>
                <Form.Control
                  id="username"
                  name="username"
                  type="text"
                  placeholder={t('auth.usernamePlaceholder')}
                  aria-label={t('auth.usernamePlaceholder')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  isInvalid={formik.touched.username && !!error}
                  className="auth-input"
                  disabled={isLoading || formik.isSubmitting}
                />
                {formik.touched.username && error && (
                  <div className="invalid-feedback d-block">{error}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="password" className="fw-semibold">{t('auth.password')}</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  aria-label={t('auth.password')}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="auth-input"
                  disabled={isLoading || formik.isSubmitting}
                />
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