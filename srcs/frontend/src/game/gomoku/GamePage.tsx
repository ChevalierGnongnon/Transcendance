import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Gomoku from "./gomoku";

function GamePage() {
  const { state } = useLocation();
  const { me, opponentId, boardSize } = state;

  const [opponent, setOpponent] = useState(null);
  

  useEffect(() => {
    fetch(`/api/user/${opponentId}`)
      .then(res => res.json())
      .then(data => setOpponent(data));
  }, [opponentId]);

  if (!opponent) return <p>zhopa</p>;

/////////////////////   mockup data from db

  const playersData = [
    {
      id: me.account_id,
      username: me.pseudo,
      symbol: "X"
    },
    {
      id: "11",
      username: "Valera",
      symbol: "O"
    }
  ];
////////////////////////////////////////////
  return <Gomoku playersData={playersData} boardSize={boardSize} />;
}

export default GamePage;
