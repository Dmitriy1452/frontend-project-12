import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deleteChannel } from '../../store/slices/channelsSlice';

const DeleteChannelModal = ({ show, onHide, channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDeleting, error } = useSelector((state) => state.channels);

  const handleDelete = async () => {
    if (!channel) return;
    
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      onHide();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.deleteTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <p>
          {t('channels.deleteConfirm')} <strong>{t('channels.channelPrefix')} {channel.name}</strong>?
        </p>
        <p className="text-muted small">
          {t('channels.deleteWarning')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isDeleting}>
          {t('channels.cancelButton')}
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? `${t('channels.deleteButton')}...` : t('channels.deleteButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;