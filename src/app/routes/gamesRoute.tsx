import { useNavigate } from "react-router";
import { GamesPage } from "@/app/modules/rewards";

export function GamesRoute() {
  const navigate = useNavigate();
  return (
    <GamesPage
      onBack={() => navigate("/play")}
      onPlay={(id) => { 
        if (id === "memory") navigate("/play/games/memory"); 
        else if (id === "drag") navigate("/play/games/drag");
        else if (id === "find") navigate("/play/games/find");
        else if (id === "balloon") navigate("/play/games/balloon");
        else if (id === "puzzle") navigate("/play/games/puzzle");
        else if (id === "shadow") navigate("/play/games/shadow");
        else alert("This game is coming soon!");
      }}
    />
  );
}
