import Header from "./Header.jsx";
import SocketController from "../ClientSocketController.ts";
import ChatBox from "../components/chatbox.tsx";
import apiController from "../ApiController.ts";
import Sidebar from "./Sidebar.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Room() {
  const { state } = useLocation();
  const [ste, setSte] = useState(
    state ? state : { room: "Empty!"},
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!state) {
      SocketController.leaveRoom();
      navigate("/");
    }
  });
  function handleBeforeUnload() {
    SocketController.leaveRoom();
    SocketController.refSocket.emit("leaveRoom", ste.room, apiController.getUserName());
    navigate("/");
  }
  
  window.addEventListener("beforeunload", handleBeforeUnload);

  return (
    <>
      <Header />
      <h3>Room Code #{ste.room}</h3>
      <div id="main">
        <div className="sideBar">
          <Sidebar roomId={ste.room}></Sidebar>
        </div>
      </div> 
    </>
  );
}

export default Room;
