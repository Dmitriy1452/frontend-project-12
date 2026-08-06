import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import { setCurrentChannel } from '../store/slices/channelsSlice';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const getChannelMessageCount = (channelId) => {
    return messages.filter(msg => msg.channelId === channelId).length;
  };

  return (
    <div className="channels-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Каналы</h5>
        <Button variant="outline-primary" size="sm">
          +
        </Button>
      </div>
      <ListGroup variant="flush">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={channel.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center"
          >
            <span># {channel.name}</span>
            <Badge bg="secondary" pill>
              {getChannelMessageCount(channel.id)}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelsList;