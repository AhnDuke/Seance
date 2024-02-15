import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './containers/HomePage';
import Room from './containers/Room';
import SocketController from './SocketController';

function App() {
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
    SocketController.refSocket.emit('leaving', (SocketController.refSocket.id))
    await fetch('/api/closeSession', {
      method:"POST",
      credentials:"same-origin",
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Cookie': document.cookie,
      },
    })
  }
  addEventListener("beforeunload", () => {closeSession()})
  addEventListener("load", () => {setCookie()})
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/room' element={<Room/>}/>
      </Routes>
    </>
  )
}

export default App
