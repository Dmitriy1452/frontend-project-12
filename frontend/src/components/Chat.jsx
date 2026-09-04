import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getSocket } from '../socket/socket';
import { 
  fetchChannels, 
  addChannel, 
  removeChannel, 
  renameChannel
} from '../store/slices/channelsSlice';
import { fetchMessages, addMessage } from '../store/slices/messagesSlice';
import ChannelsList from './ChannelsList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const Chat = ({ socket: providedSocket }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { 
    items: channels, 
    currentChannelId, 
    isLoading: channelsLoading, 
    error: channelsError 
  } = useSelector((state) => state.channels);
  const { 
    items: messages, 
    isLoading: messagesLoading, 
    error: messagesError 
  } = useSelector((state) => state.messages);

  const channelsRef = useRef(channels);
  
  useEffect(() => {
    channelsRef.current = channels;
  }, [channels]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchChannels());
      dispatch(fetchMessages());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
  let socket;

  try {
    socket = providedSocket || getSocket();
  } catch (e) {
    return undefined;
  }

  const handleNewMessage = (message) => {
    dispatch(addMessage(message));
  };

  const handleNewChannel = (channel) => {
    const exists = channelsRef.current.some(ch => ch.id === channel.id);

    if (!exists) {
      dispatch(addChannel(channel));
    }
  };

  const handleRenameChannel = (channel) => {
    dispatch(renameChannel(channel));
  };

  const handleRemoveChannel = (channelId) => {
    dispatch(removeChannel(channelId));
  };

  socket.on('newMessage', handleNewMessage);
  socket.on('newChannel', handleNewChannel);
  socket.on('renameChannel', handleRenameChannel);
  socket.on('removeChannel', handleRemoveChannel);

  return () => {
    socket.off('newMessage', handleNewMessage);
    socket.off('newChannel', handleNewChannel);
    socket.off('renameChannel', handleRenameChannel);
    socket.off('removeChannel', handleRemoveChannel);
  };
}, [dispatch, providedSocket]);

  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Alert variant="info">
          Пожалуйста, войдите в систему, чтобы увидеть чат.
        </Alert>
      </div>
    );
  }

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (channelsError || messagesError) {
    const errorText = typeof channelsError === 'string' 
      ? channelsError 
      : typeof messagesError === 'string'
        ? messagesError
        : 'Ошибка загрузки данных';
    
    return (
      <Alert variant="danger" className="m-3 w-100">
        <h5>Ошибка загрузки данных</h5>
        <p>{errorText}</p>
      </Alert>
    );
  }

  const currentMessages = messages.filter(
    msg => msg.channelId === currentChannelId
  );

  return (
    <Row className="m-0 h-100">
      <Col
        md={3}
        className="bg-white border-end p-0 h-100"
        style={{ overflowY: 'auto' }}
      >
        <ChannelsList
          channels={channels}
          currentChannelId={currentChannelId}
        />
      </Col>

      <Col md={9} className="d-flex flex-column p-0 bg-white h-100">
        <div
          className="flex-grow-1 overflow-auto p-3"
          style={{ backgroundColor: '#ffffff' }}
        >
          <MessageList messages={currentMessages} />
        </div>

        <div
          className="p-3 border-top bg-white"
          style={{ flexShrink: 0 }}
        >
          <MessageForm currentChannelId={currentChannelId} />
        </div>
      </Col>
    </Row>
  );
};

export default Chat;