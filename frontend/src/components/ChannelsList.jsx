import React from 'react';
import { useDispatch } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import { setCurrentChannel } from '../store/slices/channelsSlice';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();

  return (
    <div className="p-3" style={{ backgroundColor: '#ffffff' }}>
      <h5 className="mb-3 fw-bold text-secondary">Каналы</h5>
      <ListGroup variant="flush">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={channel.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center px-3 py-2 border-0"
            style={{
              borderRadius: '8px',
              marginBottom: '2px',
              backgroundColor: channel.id === currentChannelId ? '#e7f3ff' : 'transparent',
              color: channel.id === currentChannelId ? '#0d6efd' : '#212529',
              fontWeight: channel.id === currentChannelId ? '600' : '400',
            }}
          >
            <span># {channel.name}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelsList;