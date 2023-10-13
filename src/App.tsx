import { Socket } from 'socket.io';
import './App.css'
import {SocketOptions, io} from 'socket.io-client'
import Header from './containers/Header';

function App() {
  //method to start a socket and room
  let socket:Socket;
  async function createRoom(check:boolean){
    if(check){
      socket = io('http://68.96.78.126:3000/');
    }
    socket.emit('createRoom', socket.id)
  }

  async function joinRoom(){
    const checkResponse = await fetch('/api/check', {
      method:"POST", 
      body:JSON.stringify({stuff: document.cookie}), 
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    const socketAvailable = await checkResponse.json();
    if(socketAvailable.socketStatus){
      socket = io('http://68.96.78.126:3000/')
    }
    const roomId = document.getElementById('roomId').value;
    console.log(roomId);
    console.log(socket.rooms)
    socket.emit('joinRoom', roomId);
    socket.on('joined', () => {
      console.log('Joined Room: ' + roomId);
    })
    
    socket.on('invalidRoomId', () => {
      console.log('ROOM DOES NOT EXIST');
    })
  }

  //method to check if room is available for user
  async function newRoom(){
    console.log(document.cookie)
    const check = await fetch('/api/check', {
      method:"POST", 
      body:JSON.stringify({stuff: document.cookie}), 
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    const checkFinal = await check.json();
    if(await checkFinal.roomAvailable){
      return createRoom(checkFinal.socketStatus);
    }
    else{
      return alert('User Created Room Already Exists!');
    }
  }

  //method to start user session if not existing
  async function setCookie(){
    if(document.cookie !== ''){
      return;
    }
    else{
      const stuff = await fetch('/api/startSession', {method:"GET"});
      const sessionId = await stuff.json();
      document.cookie = `sessionId = ${await sessionId}`
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

  addEventListener("beforeunload", () => {closeSession()})
  addEventListener("load", () => {setCookie()})
  return (
    <>
      <Header></Header>
      <div className='mainBox'>
        <div className='buttonBox'>
          <button id='createRoom' onClick={() => newRoom()}> Create Room </button>
          <div className='joinBox'>
            <button id='joinRoom' onClick={() => joinRoom()}> Join Room </button>
            <input id='roomId' placeholder={'Room key'} maxLength={4} onKeyDown={(key) => {if(key.key === 'enter'){() => joinRoom()}}}></input>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
