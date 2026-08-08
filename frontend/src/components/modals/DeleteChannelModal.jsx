import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';
import { deleteChannel } from '../../store/slices/channelsSlice';

const DeleteChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const { isDeleting, error } = useSelector((state) => state.channels);

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      onHide();
    } catch (err) {
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <p>
          Вы уверены, что хотите удалить канал <strong>#{channel.name}</strong>?
        </p>
        <p className="text-muted small">
          Все сообщения в этом канале будут удалены. Вы будете перемещены в канал #general.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isDeleting}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;