import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { createChannel } from '../../store/slices/channelsSlice';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreateChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { items: channels, isCreating, error } = useSelector((state) => state.channels);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Имя канала должно быть от 3 до 20 символов')
      .max(20, 'Имя канала должно быть от 3 до 20 символов')
      .matches(/^[a-zA-Z0-9а-яА-Я_-]+$/, 'Разрешены только буквы, цифры, _ и -')
      .notOneOf(
        channels.map(ch => ch.name),
        'Канал с таким именем уже существует'
      )
      .required('Имя канала обязательно'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(createChannel({ name: values.name })).unwrap();
      resetForm();
      onHide();
    } catch (err) {
      console.error('Create channel error:', err);
    }
  };

  console.log('CreateChannelModal render, show:', show);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Создать канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, errors, touched, isValid }) => {
          console.log('Formik render, values:', values);
          return (
            <FormikForm onSubmit={handleSubmit}>
              <Modal.Body>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                <Form.Group controlId="channelName">
                  <Form.Label>Название канала</Form.Label>
                  <Field
                    innerRef={inputRef}
                    type="text"
                    name="name"
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                    placeholder="Введите название канала"
                    disabled={isCreating}
                  />
                  <ErrorMessage name="name" component="div" className="invalid-feedback" />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isCreating}>
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isCreating || !isValid || !values.name}
                >
                  {isCreating ? 'Создание...' : 'Создать'}
                </Button>
              </Modal.Footer>
            </FormikForm>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default CreateChannelModal;