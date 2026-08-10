import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ListGroup } from 'react-bootstrap';

const MessageList = ({ messages }) => {
  const { t } = useTranslation();
  const { username } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center text-muted mt-5">
        <p>{t('chat.noMessages')}</p>
      </div>
    );
  }

  return (
    <ListGroup variant="flush" style={{ backgroundColor: '#ffffff' }}>
      {messages.map((message) => {
        const isOwnMessage = message.username === username;
        return (
          <ListGroup.Item 
            key={message.id} 
            className="border-0 px-0 py-2"
            style={{ backgroundColor: 'transparent' }}
          >
            <div>
              <strong 
                className={isOwnMessage ? 'text-primary' : 'text-secondary'}
                style={{ fontWeight: '600' }}
              >
                {message.username}
              </strong>
              <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div 
              className="mt-1"
              style={{
                backgroundColor: isOwnMessage ? '#e7f3ff' : '#f1f3f5',
                padding: '8px 12px',
                borderRadius: '12px',
                display: 'inline-block',
                maxWidth: '80%',
                wordWrap: 'break-word',
              }}
            >
              {message.body}
            </div>
          </ListGroup.Item>
        );
      })}
      <div ref={messagesEndRef} />
    </ListGroup>
  );
};

export default MessageList;