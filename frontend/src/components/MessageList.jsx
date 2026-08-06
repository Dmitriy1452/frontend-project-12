import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, ListGroup } from 'react-bootstrap';

const MessageList = () => {
  const { items: messages } = useSelector((state) => state.messages);
  const { currentChannelId } = useSelector((state) => state.channels);
  const { username } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const channelMessages = messages.filter(
    msg => msg.channelId === currentChannelId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  return (
    <div className="message-list" style={{ height: '400px', overflowY: 'auto' }}>
      <ListGroup variant="flush">
        {channelMessages.map((message) => (
          <ListGroup.Item key={message.id} className="border-0 px-0">
            <div>
              <strong className={message.username === username ? 'text-primary' : 'text-secondary'}>
                {message.username}
              </strong>
              <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-1">{message.body}</div>
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
    </div>
  );
};

export default MessageList;