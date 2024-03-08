import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { join } from "path";
import cookieParser from "cookie-parser";
const app: Express = express();
const server = createServer(app);
app.use(cookieParser()); // Note the `()`
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
import path from "path";
import { fileURLToPath } from "url";
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    status: 400,
    errMsg: "An unknown error occured",
  };
  const error = Object.assign(defaultErr, err);
  type ObjectKey = keyof typeof error;
  res.status(error["status" as ObjectKey]).json(error["errMsg" as ObjectKey]);
});

//set port and ip for server
server.listen(PORT, "192.168.0.16", () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default io;
