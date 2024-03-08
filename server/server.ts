import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { join } from "path";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import GameController from "./Controllers/GameController.ts";
const app: Express = express();
const server = createServer(app);
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "../")));

//send index.html on load
app.get("/", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, "../index.html"));
});

//global error handler
app.use((err: object, req: Request, res: Response) => {
  const defaultErr: object = {
    code: 400,
    errMsg: "An unknown error occurred",
  };
  const error = Object.assign(defaultErr, err);
  type ObjectKey = keyof typeof error;
  res.status(error["code" as ObjectKey]).json(error["errMsg" as ObjectKey]);
});

//set port and ip for server
server.listen(PORT, "192.168.0.16", () => {
  console.log(`Server listening on port: ${PORT}...`);
});


//SOCKET CONTROLLER
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//SOCKET CONNECTION LOGIC
io.on("connection", (socket) => {
    //on initial connection, log socket.id and leave rooms
    console.log("a user connected: " + socket.id);
    console.log(io.engine.clientsCount);
    const allRooms = socket.rooms;


    //on disconnect, log socket.id
    socket.on("disconnecting", () => {
      console.log("user has disconnected: " + socket.id);
      console.log(io.engine.clientsCount);
    });


    //on joinRoom event, join room if it exists
    socket.on("joinRoom", (roomId, name) => {
      allRooms.forEach((room) => {
        socket.leave(room);
      });
      if (GameController.getGameList().has(roomId)) {
        socket.join(roomId);
        const gameState = GameController.getGame(roomId)
        GameController.addUser(roomId, name, socket.id)
        socket.emit("joined", roomId);
        io.to(roomId).emit("userJoin", name, {gs: gameState, name: Object.fromEntries(gameState.curGame.playerList)});
        console.log(io.sockets.adapter.rooms);
      } else {
        socket.emit("invalidRoomId");
        console.log(io.sockets.adapter.rooms);
        console.log("INVALID ROOM ID");
      }
    });


    //on createroom event, create room based off last 4 of socket id if it does not exist already
    socket.on("createRoom", (name) => {
      allRooms.forEach((room) => {
        socket.leave(room);
      });
      const roomName = socket.id.slice(16, 20);
      if (io.sockets.adapter.rooms.has(roomName)) {
        socket.emit("roomExists");
      } else {
        socket.join(roomName);
        const gameState = GameController.initiate(roomName, socket.id, name);
        console.log(gameState.name)
        socket.emit("joined", roomName);
        io.to(roomName).emit("userJoin", name, gameState);
        console.log(io.sockets.adapter.rooms);
      }
    });


    //on leaveRoom event, log user leaving room. then if the room is empty, delete room from GameController memory
    socket.on("leaveRoom", (roomName: string, userName: string) => {
      console.log(userName);
      allRooms.forEach((room) => {
        socket.leave(room);
      });
      console.log(io.of("/").adapter.rooms);
      if (!io.of("/").adapter.rooms.has(roomName)) {
        GameController.closeRoom(roomName);
      } else {
        GameController.removeUser(roomName, userName);
        const playerList = GameController.getUsers(roomName);
        io.to(roomName).emit("userLeave", userName, {name: playerList});
      }
    });


    //on sendMsg event, send message to room using emit
    socket.on("sendMsg", (socketId, msg, roomId) => {
      io.to(roomId).emit("getMsg", socketId, msg);
    });


  });

export default io;
