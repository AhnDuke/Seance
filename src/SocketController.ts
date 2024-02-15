import { Socket } from 'socket.io-client';
import {io} from 'socket.io-client'

const socket: Socket = io('http://68.96.78.126:3000/');


const SocketController = {
  refSocket: socket,
  createRoom: () => {
      socket.emit('createRoom', socket.id)
  },
  joinRoom: () => {
    const roomId = document.getElementById('roomId').value;
    socket.emit('joinRoom', roomId)
  },
  leaveRoom: () => {
    socket.removeAllListeners();
  }
}

export default SocketController;