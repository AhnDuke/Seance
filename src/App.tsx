import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './containers/HomePage.js';
import Room from './containers/Room.js';

function App() {
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
