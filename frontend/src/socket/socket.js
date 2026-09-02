import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';
let socketInstance = null;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

export const initializeSocket = (token) => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  if (isConnecting) {
    return socketInstance;
  }

  isConnecting = true;
  
  socketInstance = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  socketInstance.onAny((event, ...args) => {
    console.log(`📡 Событие получено: ${event}`, JSON.stringify(args));
  });
  
  socketInstance.on('connect', () => {
    isConnecting = false;
    connectionAttempts = 0;
  });

  socketInstance.on('connect_error', (error) => {
    connectionAttempts++;
    if (connectionAttempts >= MAX_ATTEMPTS) {
      isConnecting = false;
    }
  });

  socketInstance.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      socketInstance.connect();
    }
  });

  socketInstance.io.on('reconnect', () => {
    connectionAttempts = 0;
  });

  return socketInstance;
};

export const getSocket = () => {
  if (!socketInstance) {
    const token = localStorage.getItem('token');
    if (token) {
      return initializeSocket(token);
    }
    throw new Error('Socket not initialized and no token available');
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    isConnecting = false;
    connectionAttempts = 0;
  }
};

export const isSocketConnected = () => {
  return socketInstance && socketInstance.connected;
};

export default socketInstance;