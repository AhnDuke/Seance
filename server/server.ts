import express, {Express, Request, Response, NextFunction} from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { join } from 'path';
const app: Express = express();
const server = createServer(app)
const io = new Server(server);
import path from 'path';
import { fileURLToPath } from 'url';
const PORT = 3000;

import socketController from './Controllers/SocketController.ts';

type socketKey = keyof typeof socketController;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('../client/login'))

app.get('/', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '../src/template.html'));
});

app.use('/createRoom', socketController['createRoom' as socketKey], (req:Request, res: Response) => {
  res.sendStatus(200);
})

//SOCKET HANDLER

io.on('connection', (socket) => {
  //on initial connection, log socket.id
  console.log('a user connected: ' + socket.id);
  //on disconnect, log socket.id
  socket.on('disconnecting', () => {
    console.log('user has disconnected: ' + socket.id)
  })
  //on joinroom event, join room if it exists
  socket.on('joinRoom', (roomId) => {
    if(io.sockets.adapter.rooms.has(roomId)){
      socket.join(roomId);
      io.sockets.to(roomId).emit('joined')
      console.log(io.sockets.adapter.rooms)
    }
    else{
      socket.emit('invalidRoomId');
      console.log(io.sockets.adapter.rooms)
      console.log('INVALID ROOM ID')
    }
  })
  //on createroom event, create room based off last 4 of socket id if it does not exist already
  socket.on('createRoom', () => {
    const roomName = socket.id.slice(16,20)
    if(io.sockets.adapter.rooms.has(roomName)){
      socket.emit('roomExists');
    }
    else{
    socket.join(roomName)
    io.sockets.to(roomName).emit('joined')
    console.log(io.sockets.adapter.rooms)
    }
  })
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default io;