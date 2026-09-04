import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { signup, clearError } from '../store/slices/authSlice';
import useToast from '../hooks/useToast';
import { signupValidationSchema } from '../utils/validationSchemas';

const Signup = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRegistering, error, isAuthenticated } = useSelector((state) => state.auth);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    dispatch(clearError());
    
    try {
      const result = await dispatch(signup({
        username: values.username,
        password: values.password,
      })).unwrap();
      
      if (result) {
        showSuccess(t('auth.signupSuccess'));
        navigate('/', { replace: true });
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : t('auth.signupError');
      showError(errorMessage);
      setFieldError('username', errorMessage);
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidationSchema(),
    onSubmit: handleSubmit,
  });

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card">
            <h1 className="auth-title display-6">{t('auth.signupTitle')}</h1>
            
            <Form onSubmit={formik.handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="username" className="fw-semibold">
                  {t('auth.username')}
                </Form.Label>
                <Form.Control
                  id="username"
                  ref={inputRef}
                  type="text"
                  name="username"
                  placeholder={t('auth.usernamePlaceholder')}
                  aria-label={t('auth.username')}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.username && (!!formik.errors.username || !!error)}
                  className="auth-input"
                  disabled={isRegistering || formik.isSubmitting}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="invalid-feedback d-block">{formik.errors.username}</div>
                )}
                {formik.touched.username && error && !formik.errors.username && (
                  <div className="invalid-feedback d-block">{error}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="password" className="fw-semibold">
                  {t('auth.password')}
                </Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  aria-label={t('auth.password')}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.password && !!formik.errors.password}
                  className="auth-input"
                  disabled={isRegistering || formik.isSubmitting}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="invalid-feedback d-block">{formik.errors.password}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="confirmPassword" className="fw-semibold">
                  {t('auth.confirmPassword')}
                </Form.Label>
                <Form.Control
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  aria-label={t('auth.confirmPassword')}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                  className="auth-input"
                  disabled={isRegistering || formik.isSubmitting}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="invalid-feedback d-block">{formik.errors.confirmPassword}</div>
                )}
              </Form.Group>

              <Button 
                type="submit" 
                className="auth-btn mb-3"
                disabled={isRegistering || formik.isSubmitting}
              >
                {(isRegistering || formik.isSubmitting) ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('auth.signupButton')}...
                  </>
                ) : (
                  t('auth.signupButton')
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">{t('auth.haveAccount')} </span>
                <Link to="/login" className="auth-link">
                  {t('app.login')}
                </Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;