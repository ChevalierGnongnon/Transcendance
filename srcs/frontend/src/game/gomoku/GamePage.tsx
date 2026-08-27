import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Gomoku from "./gomoku";

function GamePage() {
  const { state } = useLocation();
  const { me, opponentId, boardSize } = state;

  const [opponent, setOpponent] = useState(null);
  

  useEffect(() => {
    fetch(`/api/user/${opponentId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setOpponent(data))
      .catch(err => console.error("users error:", err));
  }, [opponentId]);
  
  if (!opponent || !me) return <p>GamePage data is not acceptable</p>;


  const playersData = [
    {
      id: me.id,
      username: me.pseudo,
      symbol: "X"
    },
    {
      id: opponent.id,
      username: opponent.pseudo,
      symbol: "O"
    }
  ];

  return <Gomoku playersData={playersData} boardSize={boardSize} />;
}

export default GamePage;
