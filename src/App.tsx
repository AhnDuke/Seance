import './App.css'
import {io} from 'socket.io-client'

function App() {
  //method to start a socket and room
  function createRoom(){
    const socket = io('http://192.168.0.16:3000/');
    console.log(socket.id)
    socket.on('connect', () => {
      console.log('a user connected: ' + socket.id)
    })
    socket.emit('createRoom', socket.id) 
  }

  function joinRoom(){
    const socket = io('http://192.168.0.16:3000/');
    const roomId = document.getElementById('roomId').value;
    console.log(roomId);
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
    const check = await fetch('/api/checkRoom', {
      method:"POST", 
      body:JSON.stringify({stuff: document.cookie}), 
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    const checkFinal = await check.json()
    if(checkFinal){
      return createRoom();
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
      <div>
        Test
      </div>
      <button id='createRoom' onClick={() => newRoom()}> Create Room </button>
      <div>
      <button id='joinRoom' onClick={() => joinRoom()}> Join Room </button>
      <input id='roomId'></input>
      </div>
    </>
  )
}

export default App
