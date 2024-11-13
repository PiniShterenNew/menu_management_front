// src/context/SocketContext.js
import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { handleSocketEvents } from '../services/socketService';

const SOCKET_URL = import.meta.env.VITE_REACT_APP_SOCKET_URL;
const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  console.log(SOCKET_URL);
  
  useEffect(() => {
    const socket = io(SOCKET_URL);
    handleSocketEvents(socket, dispatch);

    return () => socket.disconnect();
  }, [dispatch]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
