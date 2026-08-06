import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { createMessage } from '../store/slices/messagesSlice';

const MessageForm = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const { currentChannelId } = useSelector((state) => state.channels);
  const { username } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    dispatch(createMessage({
      body: message,
      channelId: currentChannelId,
      username: username,
    }));

    setMessage('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Отправить
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;