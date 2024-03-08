import PlayerList from "./PlayerList.tsx";
import ChatBox from "../components/chatbox.tsx";

function Sidebar(props) {
  return(
    <>
      <PlayerList></PlayerList>
      <ChatBox roomId={props.roomId}></ChatBox>
    </>
  )
}

export default Sidebar;
