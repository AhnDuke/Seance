import { ReactElement, useState } from "react";
import Player from "../components/player.tsx";
import SocketController from "../ClientSocketController.ts";
import { useLocation } from "react-router-dom";
import React, { FC } from 'react';


function PlayerList(){
  const { state } = useLocation();
  const [playerList, setPlayerList] = useState<ReactElement[]>([]);
  //socket connection reference
  const socket = SocketController.refSocket;

  
  socket.on('userJoin', (tag: string, players: Array<string>) => {
    setPlayerList([])
    players.forEach(el => {
      const newPlayer = Player(el);
      playerList.push(newPlayer);
    })
    setPlayerList(playerList);
  })
  socket.on('userLeave', (tag: string, players: Array<string>) => {
    setPlayerList([])
    players.forEach(el => {
      const newPlayer = Player(el);
      playerList.push(newPlayer);
    })
    setPlayerList(playerList)
  })
  
  return(
   <div>
    {playerList}
   </div> 
  )
}


export default PlayerList;