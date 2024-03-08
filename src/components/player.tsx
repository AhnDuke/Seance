import SideOpt from "./sideOptions.tsx";
import { useLocation } from "react-router-dom";

function Player(name: string){
  return(
    <div className="player" id={name}>
      <div className="sbsBox">
        {name}
        
      </div>
    </div>
  )
}

export default Player;