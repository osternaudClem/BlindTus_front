import { createContext } from 'react';
import socketio from 'socket.io-client';
import { socketApi } from '../config';

export const socket = socketio.connect(socketApi[process.env.NODE_ENV], { path: '/ws'});
export const SocketContext = createContext();