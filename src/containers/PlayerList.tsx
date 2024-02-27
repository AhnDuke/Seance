import { useState } from "react";
import Player from "../components/player.tsx";
import SideOpt from "../components/sideOptions.tsx";
import { useLocation } from "react-router-dom";


function PlayerList(){
  const { state } = useLocation();
  const [playerList, setPlayerList] = useState([]);
  

  return(
   <div>
    {}
    <SideOpt></SideOpt>
   </div> 
  )
}


export default PlayerList;