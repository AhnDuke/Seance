import SideOpt from "./sideOptions.tsx";

function Player(name: string, curLeader: boolean, roomId: string, leader: boolean){
  const leaderIcon = curLeader ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" y="0"><path d="M22 20v3h-20v-3h20zm0-17c-1.5 0-2.662 1.685-1.598 3.194.535.759.406 1.216.045 1.749-.765 1.127-1.872 2.057-3.447 2.057-2.522 0-3.854-2.083-4.131-3.848-.096-.614-.15-1.074.436-1.644.496-.481.826-1.151.645-1.947-.196-.857-.963-1.561-1.95-1.561-1.104 0-2 .896-2 2 0 .605.293 1.118.695 1.508.586.57.531 1.03.436 1.644-.278 1.764-1.61 3.848-4.131 3.848-1.575 0-2.682-.93-3.447-2.058-.362-.532-.491-.989.045-1.748 1.064-1.509-.098-3.194-1.598-3.194-1.104 0-2 .896-2 2 0 .797.464 1.495 1.144 1.808.825.379.856 1.317.856 2.171v9.021h20v-9.021c0-.854.031-1.792.856-2.171.68-.313 1.144-1.011 1.144-1.808 0-1.104-.897-2-2-2z" /></svg> : <></>;
  if(leader){
    return (
      <div className="player" id={name} key={name}>
        <div className="sbsBox">
          {leaderIcon}
          {name}
        </div>
        <SideOpt roomId={roomId} name={name}></SideOpt>
      </div>
    )
  }
  else{
    return(
      <div className="player" id={name} key={name}>
        <div className="sbsBox">
          {leaderIcon}
          {name}
        </div>
      </div>
    )
  }
}

export default Player;