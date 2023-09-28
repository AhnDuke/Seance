import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Socket } from 'socket.io';

const joinButton = (userID:String) => {
  async function createRoom(){
    await fetch('/createRoom', {method:"POST", body:JSON.stringify(userID)})
  }

  return (
    <div className='box'>
      <h1 className='boxTitle'>CREATE</h1>
      <button onClick={() => createRoom()}></button>
    </div>
  )
}

export default joinButton;