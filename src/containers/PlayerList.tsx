import { ReactElement, useState } from "react";
import Player from "../components/player.tsx";
import SocketController from "../ClientSocketController.ts";
import apiController from "../ApiController.ts";

class Game {
  settings: {
    bannedWords: Set<string>;
    killerWordBan: number;
    ghostRoundTimer: number;
    generalRoundTimer: number;
    locationRoundCount: number;
    methodRoundCount: number;
    killerRoundCount: number;
  };
  curGame: {
    leader: string;
    killer: string;
    ghost: string;
    gamePhase: string;
    playerTurn: string;
    roundCount: number;
    curGuesses: Array<string>;
    questionList: Map<string, string>;
    words: Set<string>,
    pickedWords: object,
    joinable: boolean;
    playerList: Map<string, string>;
  };
}

class gameStateResponse {
  gs: Game;
  name: object;
}

function PlayerList(){
  const [playerList, setPlayerList] = useState<ReactElement[]>([]);
  //socket connection reference
  const socket = SocketController.refSocket;

  socket.on('userJoin', (name: string, gameState: gameStateResponse) => {
    setPlayerList([])
    console.log(playerList)
    Object.keys(gameState.name).forEach(el => {
      const newPlayer = Player(el);
      playerList.push(newPlayer)
    })
    console.log(playerList)
    setPlayerList(playerList);
  })

  socket.on('userLeave', (tag: string, gameState: gameStateResponse) => {
    setPlayerList([])
    Object.keys(gameState.name).forEach(el => {
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