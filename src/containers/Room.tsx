import Header from "./Header.jsx";
import SocketController from "../SocketController.ts";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Room(){
  const { state } = useLocation()
  const [ste, setSte] = useState(state? state : {room: 'Empty!', gameState: {}, settings: {}})
  const navigate = useNavigate()
  useEffect(() => {
    if(!state){
      SocketController.leaveRoom()
      navigate('/')
    }
  })
  console.log(ste)
  function handleBeforeUnload(){
    SocketController.leaveRoom();
    SocketController.refSocket.emit('leaveRoom', ste.room)
    navigate('/')
  }
  function ping(){
    SocketController.refSocket.emit('pingRoom', ste.room, SocketController.refSocket.id)
  }
  SocketController.refSocket.on('pinged', (data) => {
    console.log('pinged from: ' + data)
  })

  window.addEventListener('beforeunload', handleBeforeUnload);
  return(
    <>
      <Header/>
      <div id="main">
        <h1>{ste.room}</h1>
        <div>{}</div>
        <div>
          <button onClick={() => ping()}>Send Ping</button>
        </div>
      </div>
    </>
  )
  }


export default Room;