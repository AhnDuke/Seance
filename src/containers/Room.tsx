import Header from "./Header";
import SocketController from "../SocketController";
import { useNavigate } from "react-router-dom";

function Room(){
  const navigate = useNavigate()
  function ping(){
    SocketController.refSocket.emit('pingRoom', SocketController.refSocket.id)
  }
  SocketController.refSocket.on('pinged', (data) => {
    console.log('pinged from: ' + data)
  })
  SocketController.refSocket.on('delete-room', () => {
    navigate('/')
  })
  return(
    <>
      <Header/>
      <div>
        <button onClick={() => ping()}>Send Ping</button>
        Room!
      </div>
    </>
  )
}

export default Room;