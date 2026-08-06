import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  return (
    <Container fluid className="app-container min-vh-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;