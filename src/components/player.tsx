import SideOpt from "./sideOptions.tsx";

function Player(name: string){
  return(
    <div className="player" id={name} key={name}>
      <div className="sbsBox">
        {name}
        <SideOpt></SideOpt>
      </div>
    </div>
  )
}

export default Player;