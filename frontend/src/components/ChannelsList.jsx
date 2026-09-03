import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
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
    return channel.removable !== false && channel.name !== 'general';
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
    <div className="p-3 h-100 d-flex flex-column" style={{ backgroundColor: '#ffffff' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-shrink-0">
        <h5 className="mb-0 fw-bold text-secondary">{t('channels.title')}</h5>
        <Button 
          id="add-channel-btn"
          variant="primary" 
          size="sm" 
          onClick={() => setShowCreateModal(true)}
          style={{ 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            padding: '0', 
            fontSize: '18px', 
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </Button>
      </div>

      <div className="flex-grow-1 overflow-auto">
        <ListGroup variant="flush">
          {channels && channels.length > 0 ? (
            channels.map((channel) => (
              <div key={channel.id} className="position-relative">
                <ListGroup.Item
                  action
                  active={channel.id === currentChannelId}
                  onClick={() => handleChannelSelect(channel.id)}
                  className="d-flex justify-content-between align-items-center px-2 py-2 border-0"
                  style={{
                    borderRadius: '8px',
                    marginBottom: '2px',
                    backgroundColor: channel.id === currentChannelId ? '#e7f3ff' : 'transparent',
                    color: channel.id === currentChannelId ? '#0d6efd' : '#212529',
                    fontWeight: channel.id === currentChannelId ? '600' : '400',
                    cursor: 'pointer',
                  }}
                  role="button"
                  aria-label={`# ${channel.name}`}
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
                        aria-label="Управление каналом"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <circle cx="8" cy="3" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="13" r="1.5" />
                        </svg>
                      </Button>
                    </OverlayTrigger>
                  )}
                </ListGroup.Item>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-3">
              Нет каналов
            </div>
          )}
        </ListGroup>
      </div>

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