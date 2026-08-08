import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getSocket } from '../socket/socket';
import { 
  fetchChannels, 
  addChannel, 
  removeChannel, 
  renameChannel 
} from '../store/slices/channelsSlice';
import { fetchMessages, addMessage, removeMessagesByChannel } from '../store/slices/messagesSlice';
import ChannelsList from './ChannelsList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const Chat = () => {
  const dispatch = useDispatch();
  const { 
    items: channels, 
    currentChannelId, 
    isLoading: channelsLoading, 
    error: channelsError 
  } = useSelector((state) => state.channels);
  const { items: messages, isLoading: messagesLoading, error: messagesError } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    let socket;
    try {
      socket = getSocket();
    } catch (e) {
      console.warn('Socket not ready');
      return;
    }

    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    const handleNewChannel = (channel) => {
      dispatch(addChannel(channel));
    };

    const handleRemoveChannel = (channelId) => {
      dispatch(removeChannel(channelId));
      dispatch(removeMessagesByChannel(channelId));
    };

    const handleRenameChannel = (channel) => {
      dispatch(renameChannel(channel));
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
    };
  }, [dispatch]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (channelsError || messagesError) {
    return (
      <Alert variant="danger" className="m-3">
        <h5>Ошибка загрузки данных</h5>
        <p>{channelsError || messagesError}</p>
      </Alert>
    );
  }

  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);

  return (
    <Row className="flex-grow-1 m-0" style={{ height: 'calc(100vh - 60px)' }}>
      <Col md={3} className="bg-white border-end p-0" style={{ height: '100%', overflowY: 'auto' }}>
        <ChannelsList channels={channels} currentChannelId={currentChannelId} />
      </Col>

      <Col md={9} className="d-flex flex-column p-0 bg-white" style={{ height: '100%' }}>
        <div className="flex-grow-1 overflow-auto p-3" style={{ height: 'calc(100% - 80px)', backgroundColor: '#ffffff' }}>
          <MessageList messages={currentMessages} />
        </div>
        <div className="p-3 border-top bg-white" style={{ height: '80px' }}>
          <MessageForm currentChannelId={currentChannelId} />
        </div>
      </Col>
    </Row>
  );
};

export default Chat;