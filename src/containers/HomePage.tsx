import { useNavigate } from 'react-router-dom';
import '../App.css'
import Header from '../containers/Header';
import SocketController from '../SocketController';
  //method to start a socket and room
function HomePage(){
  const navigate = useNavigate();
  async function setCookie(){
    if(document.cookie !== ''){
      return;
    }
    else{
      await fetch('/api/startSession', {method:"GET"});
    }
  }

  //method to end session
  async function closeSession(){
    document.cookie="sessionId = ''; expires=Sun, 20 Aug 2000 12:00:00 UTC"
    await fetch('/api/closeSession', {
      method:"POST", 
      body:JSON.stringify({stuff: document.cookie}), 
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
  SocketController.refSocket.on('joined', ()=>{
    navigate('/room')
  })
  
  SocketController.refSocket.on('connect', () => {
    console.log('connected to server')
  })
  
  SocketController.refSocket.on('disconnect', () => {
    console.log('disconnected from server');
  })

  SocketController.refSocket.on('invalidRoomId', () => {
    alert('Room Does Not Exist!')
  })
  
  addEventListener("beforeunload", () => {closeSession()})
  addEventListener("load", () => {setCookie()})
  return (
    <>
      <Header></Header>
      <div className='mainBox'>
        <div className='buttonBox'>
          <button id='createRoom' onClick={() => SocketController.createRoom()}> Create Room </button>
          <div className='joinBox'>
            <button id='joinRoom' onClick={() => SocketController.joinRoom()}> Join Room </button>
            <input id='roomId' placeholder={'Room key'} maxLength={4} onKeyDown={(key) => {if(key.key === 'enter'){() => SocketController.joinRoom()}}}></input>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage;