import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ChannelsList from './ChannelsList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages } from '../store/slices/messagesSlice';

const Chat = () => {
  const dispatch = useDispatch();
  const { isLoading: channelsLoading, error: channelsError } = useSelector((state) => state.channels);
  const { isLoading: messagesLoading, error: messagesError } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (channelsError || messagesError) {
    return (
      <div className="text-center text-danger">
        <p>Ошибка загрузки данных</p>
        <p className="small">{channelsError || messagesError}</p>
      </div>
    );
  }

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col md={3} className="border-end bg-light" style={{ height: '80vh' }}>
          <ChannelsList />
        </Col>
        <Col md={9} className="d-flex flex-column" style={{ height: '80vh' }}>
          <div className="flex-grow-1 overflow-auto">
            <MessageList />
          </div>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;