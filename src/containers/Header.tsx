import { useNavigate } from "react-router-dom"
import SocketController from "../SocketController";
function Header(){
  const navigate = useNavigate();
  function leaveRoom(){
    fetch('/api/resetSocket', {
      method:"POST", 
      body:JSON.stringify({stuff: document.cookie}), 
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(() => {
      SocketController.refSocket.emit('leaveRoom')
    })
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