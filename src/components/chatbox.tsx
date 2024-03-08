import { useState } from "react";
import SocketController from "../ClientSocketController.ts";
import apiController from "../ApiController.ts";

function ChatBox(props) {
  const name: string = apiController.getUserName();
  const roomId: string = props.roomId;
  const socket = SocketController.refSocket;
  const [messages, setMessage] = useState<string[]>([]);
  socket.on("userJoin", (tag: string) => {
    const temp = messages.slice();
    temp.push(`${tag} has joined!\n`);
    setMessage(temp);
  });
  socket.on("userLeave", (userName) => {
    console.log(userName);
    const temp = messages.slice();
    temp.push(`${userName} has disconnected!\n`);
    setMessage(temp);
  });
  socket.on("getMsg", (tag: string, msg: string) => {
    const temp = messages.slice();
    temp.push(`${tag}: ${msg} \n`);
    setMessage(temp);
  });

  return (
    <div id="chatMain">
      <div id="chat">
        <div id="chatBox">
          <pre>{[messages]}</pre>
        </div>
        <input
          id="message"
          type="text"
          onKeyDown={(key) => {
            if (key.key === "Enter") {
              const newMsg = document.getElementById("message");
              if (newMsg?.value !== "") {
                socket.emit("sendMsg", name, newMsg?.value, roomId);
                newMsg.value = "";
              }
            }
          }}
        ></input>
      </div>
    </div>
  );
}

export default ChatBox;
