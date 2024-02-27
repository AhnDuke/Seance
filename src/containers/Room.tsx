import Header from "./Header.jsx";
import SocketController from "../SocketController.ts";
import ChatBox from "../components/chatbox.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import apiController from "../ApiController.ts";
import Sidebar from "./Sidebars.tsx";

function Room() {
  const { state } = useLocation();
  const [ste, setSte] = useState(
    state ? state : { room: "Empty!", gameState: {}, settings: {} },
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!state) {
      SocketController.leaveRoom();
      navigate("/");
    }
  });

  function handleBeforeUnload() {
    const userName = apiController.getUserName();
    SocketController.leaveRoom();
    SocketController.refSocket.emit("leaveRoom", ste.room, userName);
    navigate("/");
  }
  SocketController.refSocket.on("pinged", (data) => {
    console.log("pinged from: " + data);
  });

  window.addEventListener("beforeunload", handleBeforeUnload);

  return (
    <>
      <Header />
      <h3>Room Code #{ste.room}</h3>
      <div id="main">
        <div className="sideBar">
          <Sidebar></Sidebar>
          <ChatBox
            name={SocketController.refSocket.id}
            roomId={ste.room}>
          </ChatBox>
        </div>
      </div> 
    </>
  );
}

export default Room;
