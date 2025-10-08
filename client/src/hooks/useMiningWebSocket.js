import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export const useMiningWebSocket = () => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [miningStatus, setMiningStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only connect if user is authenticated and is a student
    if (!user || !token || user.role !== 'student') {
      return;
    }

    // Create socket connection
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('🔌 Connected to mining WebSocket');
      setIsConnected(true);
      setError(null);
      
      // Request initial mining status
      socket.emit('getMiningStatus');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from mining WebSocket');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setError('Failed to connect to mining service');
      setIsConnected(false);
    });

    // Mining status updates
    socket.on('miningStatus', (status) => {
      console.log('📊 Received mining status update:', status);
      setMiningStatus(status);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      setError(error.message || 'WebSocket error occurred');
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token]);

  // Function to manually request mining status
  const requestMiningStatus = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('getMiningStatus');
    }
  };

  // Function to disconnect manually
  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return {
    isConnected,
    miningStatus,
    error,
    requestMiningStatus,
    disconnect
  };
};
