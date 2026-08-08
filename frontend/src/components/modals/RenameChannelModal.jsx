import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { updateChannel } from '../../store/slices/channelsSlice';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const { items: channels, isUpdating, error } = useSelector((state) => state.channels);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  if (!channel) {
    console.warn('RenameChannelModal: no channel provided');
    return null;
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Имя канала должно быть от 3 до 20 символов')
      .max(20, 'Имя канала должно быть от 3 до 20 символов')
      .matches(/^[a-zA-Z0-9а-яА-Я_-]+$/, 'Разрешены только буквы, цифры, _ и -')
      .notOneOf(
        channels
          .filter(ch => ch.id !== channel.id)
          .map(ch => ch.name),
        'Канал с таким именем уже существует'
      )
      .required('Имя канала обязательно'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log('Renaming channel:', channel.id, 'to:', values.name);
      await dispatch(updateChannel({ 
        id: channel.id, 
        data: { name: values.name } 
      })).unwrap();
      resetForm();
      onHide();
    } catch (err) {
      console.error('Update error:', err);
      setSubmitting(false);
    }
  };

  console.log('RenameChannelModal render, channel:', channel?.name);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Formik
          initialValues={{ name: channel.name || '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit, isSubmitting, values, errors, touched, isValid, dirty }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Form.Group controlId="channelName">
                <Form.Label>Новое название канала</Form.Label>
                <Field
                  innerRef={inputRef}
                  type="text"
                  name="name"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  placeholder="Введите новое название"
                  disabled={isUpdating || isSubmitting}
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </Form.Group>
              <div className="mt-3 d-flex justify-content-end gap-2">
                <Button 
                  variant="secondary" 
                  onClick={onHide} 
                  disabled={isUpdating || isSubmitting}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isUpdating || isSubmitting || !isValid || !dirty || !values.name}
                >
                  {isUpdating || isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;