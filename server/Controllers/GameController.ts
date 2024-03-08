import io from "../server.js";
import apiController from '../../src/ApiController.js'
const gameList = new Map();

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

function DefaultGameState() {
  const gameState = {
    leader: "",
    killer: "",
    ghost: "",
    gamePhase: "location",
    playerTurn: "killer",
    roundCount: 0,
    curGuesses: [],
    questionList: new Map(),
    words: new Set<string>(),
    pickedWords: {},
    joinable: true,
    playerList: new Map<string, string>()
  };
  return gameState;
}

const GameController = {
  //instantiate a new "game"
  type: Game,
  initiate: (roomName: string, socketId: string, name: string) => {
    const newGame = new Game();
    newGame.settings = {
      bannedWords: new Set(),
      killerWordBan: 0,
      ghostRoundTimer: 60,
      generalRoundTimer: 120,
      locationRoundCount: 4,
      methodRoundCount: 4,
      killerRoundCount: 4,
    };
    newGame.curGame = DefaultGameState();
    newGame.curGame.playerList.set(name, socketId);
    newGame.curGame.leader = socketId;
    gameList.set(roomName, newGame);
    return {gs: GameController.getGame(roomName), name: GameController.getUsers(roomName)};
  },
  randomKiller: (roomName: string) => {
    const game = gameList.get(roomName);
    const randomNum = Math.floor(Math.random() * (game.curGame.playerList.size()+1));
    const users = game.curGame.playerList.keys();
    const user = users[randomNum];
    game.killer = user;
  },
  startGame: (roomName: string) => {
    const curGame = gameList.get(roomName).curGame;
    curGame.joinable = false;
    io.to(roomName).emit("gameStart", curGame);
  },
  pickGhost: (roomName: string, name: string) => {
    const users = GameController.getUsers(roomName);
    const user = users.get(name);
    user.role = 'ghost';
    users.set(name, user)
  },
  changePhase: (roomName: string, phase: string) => {
    const curGame = gameList.get(roomName).curGame;
    curGame.gamePhase = phase;
    curGame.roundCount = 1;
    return { newPhase: phase };
  },
  nextRound: (roomName: string) => {
    const game = gameList.get(roomName);
    const phase = game.curGame.gamePhase;
    game.curGame.roundCount++;
    if (game.curGame.roundCount > game.settings[`${phase}RoundCount`]) {
      return GameController.gameOver(roomName);
    }
    return true;
  },
  changeLeader: (roomName: string, socketId: string) => {
    gameList.get(roomName).curGame.leader = socketId;
    io.to(roomName).emit("changeLeader", socketId);
  },
  correctWord: (roomName: string, word: string) => {
    const game = gameList.get(roomName);
    game.curGame.curGuesses.push(word);
    if (game.curGame.curGuesses.length >= 3) {
      const list = [...game.curGame.curGuesses];
      GameController.gameWin(roomName);
      return list;
    } else return false;
  },
  questionList: (roomName: string, socketId: string, newQuestion: string) => {
    const game = gameList.get(roomName);
    game.curGame.questionList.set(socketId, {
      question: newQuestion,
      votes: [],
    });
  },
  vote: (roomName: string, socketId: string, voterSocketId: string) => {
    const game = gameList.get(roomName);
    game.curGame.questionList[`${socketId}`].votes.push(voterSocketId);
    return game.curGame.questionList[`${socketId}`].votes;
  },
  gameWin: (roomName: string) => {
    const game = gameList.get(roomName);
    game.curGame = DefaultGameState();
    const curGame = gameList.get(roomName).curGame;
    curGame.joinable = true;
  },
  gameOver: (roomName: string) => {
    const game = gameList.get(roomName);
    game.curGame = DefaultGameState();
    const curGame = gameList.get(roomName).curGame;
    curGame.joinable = true;
  },
  closeRoom: (roomName: string) => {
    console.log('Closing Room: ' + roomName);
    return gameList.delete(roomName);
  },
  getUsers: (roomName: string) => {
    const users = Object.fromEntries(gameList.get(roomName).curGame.playerList);
    return users;
  },
  addUser: (roomName: string, userName: string, socketId: string) => {
    const game = gameList.get(roomName).curGame;
    game.playerList.set(userName, socketId);
    const users = Object.fromEntries(gameList.get(roomName).curGame.playerList);
    return users;
  },
  removeUser: (roomName: string, userName: string) => {
    const game = gameList.get(roomName).curGame;
    game.playerList.delete(userName);
    const users = Object.fromEntries(gameList.get(roomName).curGame.playerList);
    return users;
  },
  getGameList: () => {
    return gameList;
  },
  getRelatedWords: async(word:string) => {
    return await apiController.getRelated(word);
  },
  getGame: (roomId: string) => {
    return gameList.get(roomId);
  }
};

export default GameController;
