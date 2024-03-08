import { useState } from "react";
import Player from "../components/player.tsx";
import SideOpt from "../components/sideOptions.tsx";
import SocketController from "../ClientSocketController.ts";
import { useLocation } from "react-router-dom";


function PlayerList(){
  const { state } = useLocation();
  const [playerList, setPlayerList] = useState([]);
  //socket connection reference
  const socket = SocketController.refSocket;
  socket.on('userJoin', (tag: string, players: Array<string>) => {

  })
  //on player join, get updated player list from socket connection, display new list
  
  return(
   <div>
    {}
    <SideOpt></SideOpt>
   </div> 
  )
}


export default PlayerList;