import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form as BSForm, Button, Alert } from 'react-bootstrap';
import { signup, clearError } from '../store/slices/authSlice';

const Signup = () => {
  const { t } = useTranslation();
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

  const handleSubmit = async (values, { resetForm }) => {
    dispatch(clearError());
    
    try {
      const result = await dispatch(signup({
        username: values.username,
        password: values.password,
      })).unwrap();
      
      if (result) {
        navigate('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
          <div className="auth-card">
            <h1 className="auth-title display-6">{t('auth.signupTitle')}</h1>
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {typeof error === 'string' ? error : t('errors.signupFailed')}
              </Alert>
            )}

            <Formik
              initialValues={{
                username: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, isSubmitting, values, errors, touched, isValid }) => (
                <Form onSubmit={handleSubmit}>
                  <BSForm.Group className="mb-3">
                    <BSForm.Label className="fw-semibold">{t('auth.username')}</BSForm.Label>
                    <Field
                      innerRef={inputRef}
                      type="text"
                      name="username"
                      placeholder={t('auth.usernamePlaceholder')}
                      className={`form-control auth-input ${touched.username && errors.username ? 'is-invalid' : ''}`}
                      disabled={isRegistering}
                    />
                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                  </BSForm.Group>

                  <BSForm.Group className="mb-3">
                    <BSForm.Label className="fw-semibold">{t('auth.password')}</BSForm.Label>
                    <Field
                      type="password"
                      name="password"
                      placeholder={t('auth.passwordPlaceholder')}
                      className={`form-control auth-input ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      disabled={isRegistering}
                    />
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                  </BSForm.Group>

                  <BSForm.Group className="mb-4">
                    <BSForm.Label className="fw-semibold">{t('auth.confirmPassword')}</BSForm.Label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      className={`form-control auth-input ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                      disabled={isRegistering}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                  </BSForm.Group>

                  <Button 
                    type="submit" 
                    className="auth-btn mb-3"
                    disabled={isRegistering || !isValid}
                  >
                    {isRegistering ? (
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
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;