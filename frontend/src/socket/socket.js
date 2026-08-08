import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';
let socketInstance = null;

export const initializeSocket = (token) => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected successfully');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });
  }
  return socketInstance;
};

export const getSocket = () => {
  if (!socketInstance) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    console.log('🔌 Socket disconnected manually');
  }
};

export default socketInstance;