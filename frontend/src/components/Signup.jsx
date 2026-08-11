import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { signup, clearError } from '../store/slices/authSlice';
import useToast from '../hooks/useToast';

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
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('errors.usernameMin'))
      .max(20, t('errors.usernameMax'))
      .matches(/^[a-zA-Z0-9а-яА-Я_-]+$/, t('errors.usernameInvalid'))
      .required(t('errors.usernameRequired')),
    password: Yup.string()
      .min(6, t('errors.passwordMin'))
      .required(t('errors.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('errors.passwordMatch'))
      .required(t('errors.confirmPasswordRequired')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      dispatch(clearError());
      
      try {
        const result = await dispatch(signup({
          username: values.username,
          password: values.password,
        })).unwrap();
        
        if (result) {
          showSuccess(t('auth.signupSuccess'));
          navigate('/');
        }
      } catch (err) {
        showError(err || t('auth.signupError'));
        setSubmitting(false);
      }
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card">
            <h1 className="auth-title display-6">Регистрация</h1>
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {typeof error === 'string' ? error : t('errors.signupFailed')}
              </Alert>
            )}

            <Form onSubmit={formik.handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Имя пользователя</Form.Label>
                <Form.Control
                  ref={inputRef}
                  type="text"
                  name="username"
                  placeholder="Ваш ник"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.username && !!formik.errors.username}
                  className="auth-input"
                  disabled={isRegistering || formik.isSubmitting}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="invalid-feedback d-block">{formik.errors.username}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Пароль"
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
                <Form.Label className="fw-semibold">Подтвердите пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Подтвердите пароль"
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
                    Зарегистрироваться...
                  </>
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">Уже есть аккаунт? </span>
                <Link to="/login" className="auth-link">
                  Войти
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