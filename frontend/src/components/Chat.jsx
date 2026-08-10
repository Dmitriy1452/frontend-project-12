import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getSocket } from '../socket/socket';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages, addMessage } from '../store/slices/messagesSlice';
import ChannelsList from './ChannelsList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import useToast from '../hooks/useToast';

const Chat = () => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const dispatch = useDispatch();
  const [socketReady, setSocketReady] = useState(false);
  const { items: channels, currentChannelId, isLoading: channelsLoading, error: channelsError } = useSelector((state) => state.channels);
  const { items: messages, isLoading: messagesLoading, error: messagesError } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    let socket;
    let timeoutId;
    
    const initSocket = () => {
      try {
        socket = getSocket();
        if (socket) {
          setSocketReady(true);
          
          const handleNewMessage = (message) => {
            dispatch(addMessage(message));
          };

          socket.on('newMessage', handleNewMessage);
          
          socket.on('connect_error', () => {
            showError(t('toasts.networkError'));
          });

          return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('connect_error');
          };
        }
      } catch (e) {
        timeoutId = setTimeout(initSocket, 500);
      }
    };

    initSocket();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (socket) {
        socket.off('newMessage');
        socket.off('connect_error');
      }
    };
  }, [dispatch, showError, t]);

  useEffect(() => {
    if (channelsError && !channelsError.includes('network')) {
      showError(t('channels.loadError'));
    }
  }, [channelsError, showError, t]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (channelsError && channelsError.includes('network')) {
    return (
      <Alert variant="warning" className="m-3">
        <h5>Ошибка сети</h5>
        <p>Не удается подключиться к серверу. Проверьте интернет-соединение.</p>
      </Alert>
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