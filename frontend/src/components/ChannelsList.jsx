import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ListGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { setCurrentChannel } from '../store/slices/channelsSlice';
import CreateChannelModal from './modals/CreateChannelModal';
import DeleteChannelModal from './modals/DeleteChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';
import useToast from '../hooks/useToast';

const ChannelsList = ({ channels, currentChannelId }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.channels);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  React.useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId));
    setActiveMenu(null);
  };

  const handleDeleteClick = (channel) => {
    setSelectedChannel(channel);
    setShowDeleteModal(true);
    setActiveMenu(null);
  };

  const handleRenameClick = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
    setActiveMenu(null);
  };

  const isRemovable = (channel) => {
    return channel.removable !== false;
  };

  const renderMenuPopover = (channel) => (
    <Popover id={`popover-${channel.id}`}>
      <Popover.Body className="p-0">
        <ListGroup variant="flush">
          <ListGroup.Item 
            action 
            onClick={() => handleRenameClick(channel)}
            className="border-0"
          >
            Переименовать
          </ListGroup.Item>
          <ListGroup.Item 
            action 
            onClick={() => handleDeleteClick(channel)}
            className="border-0 text-danger"
          >
            Удалить
          </ListGroup.Item>
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="p-3" style={{ backgroundColor: '#ffffff' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold text-secondary">{t('channels.title')}</h5>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => setShowCreateModal(true)}
          style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '0', fontSize: '18px', lineHeight: '1' }}
        >
          +
        </Button>
      </div>

      <ListGroup variant="flush">
        {channels.map((channel) => (
          <div 
            key={channel.id} 
            className="d-flex justify-content-between align-items-center px-2 py-2 border-0"
            style={{
              borderRadius: '8px',
              marginBottom: '2px',
              backgroundColor: channel.id === currentChannelId ? '#e7f3ff' : 'transparent',
              color: channel.id === currentChannelId ? '#0d6efd' : '#212529',
              fontWeight: channel.id === currentChannelId ? '600' : '400',
              cursor: 'pointer',
            }}
            onClick={() => handleChannelSelect(channel.id)}
          >
            <span>{t('channels.channelPrefix')} {channel.name}</span>
            
            {isRemovable(channel) && (
              <OverlayTrigger
                trigger="click"
                placement="bottom-end"
                rootClose
                overlay={renderMenuPopover(channel)}
                show={activeMenu === channel.id}
                onToggle={() => setActiveMenu(activeMenu === channel.id ? null : channel.id)}
              >
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary"
                  style={{ textDecoration: 'none' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === channel.id ? null : channel.id);
                  }}
                >
                  <span className="visually-hidden">Управление каналом</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                  </svg>
                </Button>
              </OverlayTrigger>
            )}
          </div>
        ))}
      </ListGroup>

      <CreateChannelModal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)} 
      />
      
      <DeleteChannelModal 
        show={showDeleteModal} 
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedChannel(null);
        }}
        channel={selectedChannel}
      />
      
      <RenameChannelModal 
        show={showRenameModal} 
        onHide={() => {
          setShowRenameModal(false);
          setSelectedChannel(null);
        }}
        channel={selectedChannel}
      />
    </div>
  );
};

export default ChannelsList;