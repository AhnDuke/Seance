import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './containers/HomePage.tsx';
import Room from './containers/Room.tsx';

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
