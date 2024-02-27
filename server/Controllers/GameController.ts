import io from "../server.js";
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
    gamePhase: string;
    playerTurn: string;
    roundCount: number;
    curKiller: string;
    curGhost: string;
    curGuesses: Array<string>;
    questionList: Map<string, string>;
    joinable: boolean;
  };
}

function DefaultGameState() {
  const gameState = {
    leader: "",
    gamePhase: "location",
    playerTurn: "killer",
    roundCount: 0,
    curKiller: "",
    curGhost: "",
    curGuesses: [],
    questionList: new Map(),
    joinable: true,
  };
  return gameState;
}

const GameController = {
  //instantiate a new "game"
  initiate: (roomName: string, socketId) => {
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
    newGame.curGame.leader = socketId;
    gameList.set(roomName, newGame);
    return gameList.get(roomName);
  },
  startGame: (roomName: string) => {
    const curGame = gameList.get(roomName).curGame;
    curGame.joinable = false;
    io.to(roomName).emit("gameStart", curGame);
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
    console.log("ROOM EMPTY, DELETE GAME");
    return gameList.delete(roomName);
  },
  getGameList: () => {
    return gameList;
  },
};

export default GameController;
