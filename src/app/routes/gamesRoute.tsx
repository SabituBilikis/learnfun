import { useNavigate } from "react-router";
import { GamesPage } from "@/app/modules/rewards";

export function GamesRoute() {
  const navigate = useNavigate();
  return (
    <GamesPage
      onBack={() => navigate("/")}
      onPlay={(id) => { 
        if (id === "memory") navigate("/games/memory"); 
        else if (id === "drag") navigate("/games/drag");
        else if (id === "find") navigate("/games/find");
        else if (id === "balloon") navigate("/games/balloon");
        else if (id === "puzzle") navigate("/games/puzzle");
        else if (id === "shadow") navigate("/games/shadow");
        else alert("This game is coming soon!");
      }}
    />
  );
}
