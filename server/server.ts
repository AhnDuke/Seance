import express, {Express, Request, Response} from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { join } from 'path';
import SessionController from './Controllers/SessionController.js';
const app: Express = express();
const server = createServer(app)
const io = new Server(server);
import path from 'path';
import { fileURLToPath } from 'url';
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../')))

//send index.html on load and set cookie
app.get('/', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '../index.html'));
});

app.use('/startSession', SessionController['startSession'],(req: Request, res: Response) => {
  res.json(res.locals.sessionId);
})

app.use('/checkRoom', (req: Request, res: Response) => {
  res.json(res.locals.checkRoomAvail);
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

app.use((err: object, req: Request, res: Response) => {
  const defaultErr: object = {
    status: 400,
    errMsg: 'An unknown error occured',
  };
  const error = Object.assign(defaultErr, err);
  type ObjectKey = keyof typeof error;
  res.status(error['status' as ObjectKey]).json(error['errMsg' as ObjectKey]);
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default io;