import { ReactElement, useState } from "react";
import Player from "../components/player.tsx";
import SocketController from "../ClientSocketController.ts";
import apiController from "../ApiController.ts";

  class settings {
    bannedWords: Set<string>;
    killerWordBan: number;
    ghostRoundTimer: number;
    generalRoundTimer: number;
    locationRoundCount: number;
    methodRoundCount: number;
    killerRoundCount: number;
  };
  class curGame {
    leader: string;
    killer: string;
    ghost: string;
    gamePhase: string;
    playerTurn: string;
    roundCount: number;
    curGuesses: Array<string>;
    questionList: Map<string, string>;
    words: Set<string>;
    pickedWords: object;
    joinable: boolean;
    playerList: Map<string, string>;
  };

class gameStateResponse {
  gs: {
    settings: settings;
    curGame: curGame;
  };
  name: object;
}

function PlayerList(props){
  const [playerList, setPlayerList] = useState<ReactElement[]>([]);
  const [settingsState, setSettings] = useState<settings>()
  const [gameState, setGameState] = useState<curGame>()
  //socket connection reference
  const socket = SocketController.refSocket;
  let leader = false;

  function leaderCheck(socketId: string){
    if(socket.id === socketId){
      leader = true
    }
    else{
      leader = false;
    }
  }


  socket.on('userJoin', (name: string, gameSte: gameStateResponse) => {
    console.log('entered')
    const newList: ReactElement[] = [];
    const lid: string = gameSte.gs.curGame?.leader as string;
    leaderCheck(lid)
    Object.keys(gameSte.name).forEach(el => {
      const check = gameSte.name[el as keyof object] === gameSte.gs.curGame.leader
      if(check){
        const newPlayer = Player(el, true, props.roomId, leader);
        newList.push(newPlayer);
      }
      else{
        const newPlayer = Player(el, false, props.roomId, leader);
        newList.push(newPlayer);
      }
    })
    setPlayerList(newList);
  })

  socket.on('userLeave', (tag: string, gameSte: gameStateResponse) => {
    console.log('exited')
    const newList: ReactElement[] = [];
    const lid: string = gameSte.gs.curGame?.leader as string;
    leaderCheck(lid)
    Object.keys(gameSte.name).forEach(el => {
      const check = gameSte.name[el as keyof object] === gameSte.gs.curGame.leader
      if(check){
        const newPlayer = Player(el, true, props.roomId, leader);
        newList.push(newPlayer);
      }
      else{
        const newPlayer = Player(el, false, props.roomId, leader);
        newList.push(newPlayer);
      }
    })
    setPlayerList(newList)
  })

  return(
   <div>
    {playerList}
   </div> 
  )
}


export default PlayerList;