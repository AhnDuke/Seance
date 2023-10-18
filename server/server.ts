import express, {Express, Request, Response} from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { join } from 'path';
import SessionController from './Controllers/SessionController.js';
import GameController from './Controllers/GameController.js';
import cookieParser from 'cookie-parser'
const app: Express = express();
const server = createServer(app)

app.use(cookieParser()); // Note the `()`
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
import path from 'path';
import { fileURLToPath } from 'url';
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//allow all cors
// app.use(cors({
//   origin: '*'
// }))
// app.use((req:Request, res:Response, next:NextFunction) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../')))

//send index.html on load and set cookie
app.get('/', (req: Request, res: Response) => {
  res.sendFile(join(__dirname, '../index.html'));
});

app.use('/startSession', SessionController['startSession'], (req: Request, res: Response) => {
  res.cookie('sessionId', res.locals.sessionId)
  res.sendStatus(200)
})

app.use('/closeSession', SessionController['closeSession'], (req: Request, res: Response) => {
  res.sendStatus(200);
})

app.use('/check', SessionController['verifyRoomAvail'], SessionController['verifySocketAvail'], (req: Request, res: Response) => {
  console.log('check')
  console.log(res.locals.check)
  res.json(res.locals.check);
})

app.use('/resetSocket', SessionController['resetSocket'], (req: Request, res: Response) => {
  console.log('Reset!')
  res.sendStatus(200)
})

//SOCKET HANDLER

io.on('connection', (socket) => {
  //on initial connection, log socket.id and leave rooms
  console.log('a user connected: ' + socket.id);
  const allRooms = socket.rooms;
  //on disconnect, log socket.id
  socket.on('disconnecting', () => {
    console.log('user has disconnected: ' + socket.id)
  })
  //on joinroom event, join room if it exists
  socket.on('joinRoom', (roomId) => {
    allRooms.forEach((room)=> {
      socket.leave(room);
    })
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
    allRooms.forEach((room)=> {
      socket.leave(room);
    })
    const roomName = socket.id.slice(16,20)
    if(io.sockets.adapter.rooms.has(roomName)){
      socket.emit('roomExists');
    }
    else{
    socket.join(roomName)
    const returnedStuff = GameController.initiate(roomName);
    console.log(returnedStuff)
    io.sockets.to(roomName).emit('joined')
    console.log(io.sockets.adapter.rooms)
    }
  })
  socket.on('leaveRoom', () => {
    const roomName = socket.id.slice(16,20)
    if(allRooms.has(roomName)){
      allRooms.clear()
    }
    console.log('socket left room: ' + socket.id)
    socket.leave(roomName)
  })
  socket.on('pingRoom', () => {
    console.log(io.sockets.adapter.socketRooms(socket.id)?.keys().next().value)
    io.to(io.sockets.adapter.socketRooms(socket.id)?.keys().next().value).emit('pinged', socket.id)
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

server.listen(PORT, '192.168.0.16',() => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default io;