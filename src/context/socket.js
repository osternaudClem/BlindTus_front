import { createContext } from 'react';
import socketio from 'socket.io-client';
import { api } from '../config';

export const socket = socketio.connect(api.socket);
export const SocketContext = createContext();