import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { updateChannel } from '../../store/slices/channelsSlice';
import useToast from '../../hooks/useToast';
import { validateChannelName, filterProfanity } from '../../utils/profanityFilter';

const RenameChannelModal = ({ show, onHide, channel }) => {
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();
  const dispatch = useDispatch();
  const { items: channels, isUpdating, error } = useSelector((state) => state.channels);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  if (!channel) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newName = form.name.value.trim();
    
    if (!newName || newName === channel.name) return;
    
    const validation = validateChannelName(newName);
    
    if (!validation.isValid) {
      showWarning(t('toasts.profanityDetected'));
      if (validation.filtered) {
        form.name.value = validation.filtered;
        showWarning('Предлагаемый вариант: ' + validation.filtered);
        return;
      }
      return;
    }
    
    if (channels.some(ch => ch.id !== channel.id && ch.name === newName)) {
      showError(t('channels.channelExists'));
      return;
    }
    
    const filteredName = filterProfanity(newName);
    
    try {
      await dispatch(updateChannel({ 
        id: channel.id, 
        data: { name: filteredName } 
      })).unwrap();
      showSuccess(t('channels.renameSuccess', { name: filteredName }));
      onHide();
    } catch (err) {
      showError(t('channels.renameError'));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameTitle')}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form.Group controlId="channelName">
            <Form.Label>Имя канала</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="name"
              defaultValue={channel.name}
              placeholder={t('channels.channelNewNamePlaceholder')}
              disabled={isUpdating}
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9а-яА-Я_-]+$"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isUpdating}>
            {t('channels.cancelButton')}
          </Button>
          <Button type="submit" variant="primary" disabled={isUpdating}>
            {isUpdating ? `${t('channels.renameButton')}...` : t('channels.renameButton')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default RenameChannelModal;