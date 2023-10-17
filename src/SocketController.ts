import { Socket } from 'socket.io';
import {io} from 'socket.io-client'
let connected = false
let socket: Socket;
if(connected === false){
  socket = io('http://68.96.78.126:3000/');
  connected = true;
}

const SocketController = {
  refSocket: socket,
  check: async ():Promise<object> => {
    const checkResponse = await fetch('/api/check', {
      method:"GET",
      credentials:'same-origin', 
      headers: {
        'Cookie': document.cookie,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    const checkValue = await checkResponse.json();
    return checkValue;
  },
  createRoom: async () => {
    const checked:object = await SocketController.check();
    if(checked.roomAvailable){
      socket.emit('createRoom', socket.id)
    }
    else{
      alert('Room Already Exists!')
    }
  },
  joinRoom: () => {
    const roomId = document.getElementById('roomId').value;
    fetch('/api/resetSocket', {
      method:"GET",
      credentials:'same-origin', 
      headers: {
        'Cookie': document.cookie,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    console.log(roomId)
    socket.emit('joinRoom', roomId)
  }
}

export default SocketController;