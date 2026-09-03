import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { sendMessage } from '../store/slices/messagesSlice';
import useToast from '../hooks/useToast';
import { validateMessage, filterProfanity } from '../utils/profanityFilter';

const MessageForm = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const { showError, showWarning } = useToast();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const { username } = useSelector((state) => state.auth);
  const { sendingMessage } = useSelector((state) => state.messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsFiltered(false);

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError('Сообщение не может быть пустым');
      return;
    }

    const validation = validateMessage(trimmedMessage);
    
    if (!validation.isValid) {
      if (validation.filtered && validation.filtered !== trimmedMessage) {
        setError(t('chat.messageProfanity'));
        showWarning(t('toasts.profanityDetected'));
        setMessage(validation.filtered);
        setIsFiltered(true);
        return;
      }
      setError(validation.message || 'Некорректное сообщение');
      return;
    }

    const filteredMessage = filterProfanity(trimmedMessage);
    
    try {
      await dispatch(sendMessage({
        body: filteredMessage,
        channelId: currentChannelId,
        username: username,
      })).unwrap();
      setMessage('');
      setIsFiltered(false);
      setError(null);
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : t('chat.sendError');
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setIsFiltered(false);
    if (error) {
      setError(null);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-2">
          {error}
        </Alert>
      )}
      {isFiltered && (
        <Alert variant="info" dismissible onClose={() => setIsFiltered(false)} className="mb-2">
          Сообщение было отфильтровано от нецензурных слов
        </Alert>
      )}
      <Form onSubmit={handleSubmit} className="h-100 d-flex align-items-center">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('chat.messagePlaceholder')}
            value={message}
            onChange={handleMessageChange}
            disabled={sendingMessage}
            aria-label="Новое сообщение"
            style={{
              borderRadius: '20px 0 0 20px',
              border: '1px solid #dee2e6',
              padding: '10px 16px',
            }}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={sendingMessage || !message.trim()}
            style={{
              borderRadius: '0 20px 20px 0',
              padding: '10px 24px',
              backgroundColor: '#0d6efd',
              border: '1px solid #0d6efd',
            }}
          >
            {sendingMessage ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {t('chat.sending')}
              </>
            ) : (
              t('chat.sendButton')
            )}
          </Button>
        </InputGroup>
      </Form>
    </>
  );
};

export default MessageForm;