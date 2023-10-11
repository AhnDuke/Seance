import './App.css'
import { Socket } from 'socket.io'

function App() {
  async function newRoom(){
    const check = await fetch('/api/checkRoom')
  }
  async function setCookie(){
    const stuff = await fetch('/api/startSession', {method:"GET"});
    const sessionId = stuff.json();
    document.cookie = `sessionId = ${await sessionId}`
  }
  addEventListener("load", async () => {setCookie()});
  return (
    <>
      <div>
        Test
      </div>
      <button id='createRoom' onClick={() => newRoom()}> Create Room </button>
      <div>
      <button id='joinRoom'> Join Room </button>
      <input id='roomId'></input>
      </div>
    </>
  )
}

export default App
