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
    <div id="room">
        <Header/>
        <div>
          Room!
        </div>
        <div className="chatBox">
          <div className="chatLog">
          </div>
          <div className="sendMessage">
            <input className="messageInput" type="text" defaultValue={'Enter Message'}></input>
            <button onClick={() => ping()}>Send Ping</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Room;