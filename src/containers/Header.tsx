import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

import SocketController from "../SocketController";
function Header(){
  const navigate = useNavigate();
  const { state } = useLocation();
  function leaveRoom(){
    SocketController.leaveRoom();
    if(state){
      if(Object.prototype.hasOwnProperty.call(state, 'room')){
        SocketController.refSocket.emit('leaveRoom', state.room)
      }
    }
    navigate('/');
    return
  }
  return (
    <>
    <div className="header">
      <div className="logo" onClick={() => leaveRoom()}>
          SEANCE
      </div>
    </div>
    </>
  )
}

export default Header