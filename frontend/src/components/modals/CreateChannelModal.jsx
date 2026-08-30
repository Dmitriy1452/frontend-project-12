import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { createChannel } from '../../store/slices/channelsSlice';
import useToast from '../../hooks/useToast';
import { filterProfanity } from '../../utils/profanityFilter';
import { createChannelValidationSchema } from '../../utils/validationSchemas';

const CreateChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();
  const dispatch = useDispatch();
  const { items: channels, isCreating, error } = useSelector((state) => state.channels);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  const validationSchema = createChannelValidationSchema(channels);

  const handleSubmit = async (values, { resetForm, setFieldValue, setSubmitting }) => {
    try {
      const filteredName = filterProfanity(values.name);
      
      if (filteredName !== values.name) {
        showWarning(t('toasts.profanityDetected'));
      }
      
      const result = await dispatch(createChannel({ name: filteredName })).unwrap();
      showSuccess(t('channels.createSuccess', { name: filteredName }));
      resetForm();
      onHide();
    } catch (err) {
      showError(t('channels.createError'));
    } finally {
      setSubmitting(false);
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
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ handleSubmit, isSubmitting, values, errors, touched, isValid, setFieldValue }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Modal.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              <Form.Group controlId="channelName">
                <Form.Label htmlFor="channelNameInput">{t('channels.channelName')}</Form.Label>
                <Field
                  innerRef={inputRef}
                  id="channelNameInput"
                  type="text"
                  name="name"
                  className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  placeholder={t('channels.channelNamePlaceholder')}
                  disabled={isCreating}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue('name', value);
                  }}
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
                disabled={isCreating || isSubmitting}
              >
                {isCreating || isSubmitting ? `${t('channels.createButton')}...` : t('channels.createButton')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateChannelModal;