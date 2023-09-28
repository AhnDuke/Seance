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

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);
  socket.on('createRoom', (id) => {
    const roomName = id.slice(16,20)
    socket.join(roomName)
    io.sockets.to(roomName).emit('joined')
    console.log(roomName)
  })
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default io;