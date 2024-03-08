import io from "../server.ts";
import GameController from "./GameController.ts";



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
        const gameState = GameController.getGameList().get(roomId);
        socket.emit("joined", roomId, gameState.curGame, gameState.settings);
        io.to(roomId).emit("userJoin", name);
        console.log(io.sockets.adapter.rooms);
      } else {
        socket.emit("invalidRoomId");
        console.log(io.sockets.adapter.rooms);
        console.log("INVALID ROOM ID");
      }
    });


    //on createroom event, create room based off last 4 of socket id if it does not exist already
    socket.on("createRoom", () => {
      allRooms.forEach((room) => {
        socket.leave(room);
      });
      const roomName = socket.id.slice(16, 20);
      if (io.sockets.adapter.rooms.has(roomName)) {
        socket.emit("roomExists");
      } else {
        socket.join(roomName);
        const returnedStuff = GameController.initiate(roomName, socket.id);
        socket.emit("joined", roomName, returnedStuff);
        console.log(io.sockets.adapter.rooms);
      }
    });


    //on leaveRoom event, log user leaving room. then if the room is empty, delete room from GameController memory
    socket.on("leaveRoom", (roomId: string, userName: string) => {
      console.log(userName);
      allRooms.forEach((room) => {
        socket.leave(room);
      });
      console.log(io.of("/").adapter.rooms);
      if (!io.of("/").adapter.rooms.has(roomId)) {
        GameController.closeRoom(roomId);
      } else {
        io.to(roomId).emit("userLeave", userName);
      }
    });


    //on sendMsg event, send message to room using emit
    socket.on("sendMsg", (socketId, msg, roomId) => {
      io.to(roomId).emit("getMsg", socketId, msg);
    });


  });