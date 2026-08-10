import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { logout } from '../store/slices/authSlice';
import { disconnectSocket } from '../socket/socket';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
    navigate('/login');
  };

  return (
    <Navbar bg="white" className="border-bottom shadow-sm py-2">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
          Hexlet Chat
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted fw-medium">{username}</span>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={handleLogout}
                className="px-3"
              >
                Выйти
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-primary" 
                size="sm"
                className="px-3"
              >
                Войти
              </Button>
              <Button 
                as={Link} 
                to="/signup" 
                variant="primary" 
                size="sm"
                className="px-3"
              >
                Регистрация
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;