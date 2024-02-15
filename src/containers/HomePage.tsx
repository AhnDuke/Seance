import { useNavigate } from 'react-router-dom';
import '../App.css'
import Header from '../containers/Header';
import SocketController from '../SocketController.ts';
import apiController from '../ApiController.ts';
import { useState } from 'react';
  //method to start a socket and room
function HomePage(){
  const [name, setUserName] = useState(apiController.getUserName())
  const navigate = useNavigate();

  SocketController.refSocket.on('joined', (roomId, gameState)=>{
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
  return (
    <>
      <Header></Header>
        <label htmlFor='userHandle' style={{backgroundColor: '#19191c', padding: '4px', width:'10%'}}>Enter User</label>
        <div id='username'>
          <input id='userHandle' name='userHandle' type='text' defaultValue={name} maxLength={24} style={{marginBottom:'18px', marginTop:'12px', height:'50%', width:'85%'}}></input>
        </div>
      <div className='mainBox'>
        <div className='buttonBox'>
          <button id='createRoom' onClick={() => {

            SocketController.createRoom()}
          }> Create Room </button>
          <div className='joinBox'>
            <button id='joinRoom' onClick={() => {
              if(document.getElementById('userHandle').value !== ''){
                apiController.setUserName(document.getElementById('userHandle').value)
              }
              SocketController.joinRoom(apiController.getUserName())}
            }> Join Room </button>
            <input id='roomId' placeholder={'Room key'} maxLength={4} onKeyDown={(key) => {if(key.key === 'enter'){() => SocketController.joinRoom()}}}></input>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage;