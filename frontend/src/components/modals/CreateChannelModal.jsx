import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { createChannel } from '../../store/slices/channelsSlice';
import useToast from '../../hooks/useToast';

const CreateChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
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
      .min(3, t('channels.channelNameMin'))
      .max(20, t('channels.channelNameMax'))
      .matches(/^[a-zA-Z0-9а-яА-Я_-]+$/, t('channels.channelNameInvalid'))
      .notOneOf(
        channels.map(ch => ch.name),
        t('channels.channelExists')
      )
      .required(t('channels.channelNameRequired')),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const result = await dispatch(createChannel({ name: values.name })).unwrap();
      showSuccess(t('channels.createSuccess', { name: values.name }));
      resetForm();
      onHide();
    } catch (err) {
      showError(t('channels.createError'));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.createTitle')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, errors, touched, isValid }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Modal.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              <Form.Group controlId="channelName">
                <Form.Label>{t('channels.channelName')}</Form.Label>
                <Field
                  innerRef={inputRef}
                  type="text"
                  name="name"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  placeholder={t('channels.channelNamePlaceholder')}
                  disabled={isCreating}
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide} disabled={isCreating}>
                {t('channels.cancelButton')}
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isCreating || !isValid || !values.name}
              >
                {isCreating ? `${t('channels.createButton')}...` : t('channels.createButton')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateChannelModal;