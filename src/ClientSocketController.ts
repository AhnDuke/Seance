import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const socket: Socket = io("http://68.96.78.126:3000/");

const SocketController = {
  refSocket: socket,
  createRoom: (name: string) => {
    socket.emit("createRoom", name);
  },
  joinRoom: (name: string) => {
    const roomId = document.getElementById("roomId")!.value;
    socket.emit("joinRoom", roomId, name);
  },
  leaveRoom: () => {
    socket.removeAllListeners();
  },
  passHost: (roomName: string, name: string) => {
    socket.emit('passHost', roomName, name, socket.id);
  },
  kickPlayer: (roomName: string, username: string) => {
    socket.emit('kickPlayer', roomName, username, socket.id);
  }
};

export default SocketController;
