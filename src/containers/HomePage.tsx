import { useNavigate } from 'react-router-dom';
import '../App.css'
import Header from '../containers/Header';
import SocketController from '../SocketController.ts';
  //method to start a socket and room
function HomePage(){
  const navigate = useNavigate();

  SocketController.refSocket.on('joined', (roomId, gameState)=>{
    console.log(gameState)
    navigate('/room', {state:{room: roomId, gameState}})
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
  console.log(SocketController)
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