import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { sendMessage } from '../store/slices/messagesSlice';
import useToast from '../hooks/useToast';

const MessageForm = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const { username } = useSelector((state) => state.auth);
  const { sendingMessage } = useSelector((state) => state.messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      await dispatch(sendMessage({
        body: trimmedMessage,
        channelId: currentChannelId,
        username: username,
      })).unwrap();
      setMessage('');
    } catch (err) {
      setError(t('chat.sendError'));
      showError(t('chat.sendError'));
    }
  };

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-2">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit} className="h-100 d-flex align-items-center">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('chat.messagePlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sendingMessage}
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