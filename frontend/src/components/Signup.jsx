import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form as BSForm, Button, Alert } from 'react-bootstrap';
import { signup, clearError } from '../store/slices/authSlice';

const Signup = () => {
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
      .min(3, 'Имя пользователя должно быть от 3 до 20 символов')
      .max(20, 'Имя пользователя должно быть от 3 до 20 символов')
      .matches(/^[a-zA-Z0-9а-яА-Я_-]+$/, 'Разрешены только буквы, цифры, _ и -')
      .required('Имя пользователя обязательно'),
    password: Yup.string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .required('Пароль обязателен'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Подтверждение пароля обязательно'),
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
            <h1 className="auth-title display-6">Регистрация</h1>
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {typeof error === 'string' ? error : 'Произошла ошибка регистрации'}
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
                    <BSForm.Label className="fw-semibold">Имя пользователя</BSForm.Label>
                    <Field
                      innerRef={inputRef}
                      type="text"
                      name="username"
                      placeholder="Введите имя пользователя"
                      className={`form-control auth-input ${touched.username && errors.username ? 'is-invalid' : ''}`}
                      disabled={isRegistering}
                    />
                    <ErrorMessage name="username" component="div" className="invalid-feedback" />
                  </BSForm.Group>

                  <BSForm.Group className="mb-3">
                    <BSForm.Label className="fw-semibold">Пароль</BSForm.Label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Введите пароль (минимум 6 символов)"
                      className={`form-control auth-input ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      disabled={isRegistering}
                    />
                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                  </BSForm.Group>

                  <BSForm.Group className="mb-4">
                    <BSForm.Label className="fw-semibold">Подтверждение пароля</BSForm.Label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Подтвердите пароль"
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
                        Регистрация...
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
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;