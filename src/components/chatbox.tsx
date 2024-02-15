import { useEffect, useState } from "react";
import SocketController from '../SocketController.ts'



function ChatBox(props){
  const name: string = props.name;
  const roomId: string = props.roomId;
  const socket = SocketController.refSocket;
  const [messages, setMessage] = useState<string[]>([]);
  socket.on('userJoin', (tag: string) => {
    const temp = messages.slice();
    temp.push(`${tag} has joined!\n`)
    setMessage(temp)
  })
  socket.on('userLeave', (socketId) => {
    const temp = messages.slice();
    temp.push(`${socketId} has disconnected!\n`)
    setMessage(temp);
  })
  socket.on('getMsg', (tag: string, msg: string) => {
    console.log(tag, msg)
    const temp = messages.slice();
    temp.push(`${tag}: ${msg} \n`);
    setMessage(temp);
  })


  return (
    <div id='chatMain'>
      <div id='chat'>
        <div id='chatBox'>
          <pre>
            {[messages]}
          </pre>
          </div>
          <input id='message' type='text' onKeyDown={(key) => {
            console.log(key.key)
            if(key.key === 'Enter'){
              const newMsg = document.getElementById('message');
              if(newMsg?.value !== ''){
                socket.emit('sendMsg', name, newMsg?.value, roomId);
                newMsg.value = '';
              }
            }
          }}></input>
        </div>
      </div>
  )
}

export default ChatBox;