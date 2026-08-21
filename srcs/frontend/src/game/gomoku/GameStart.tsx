import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/gamestart.scss";

function GameStart() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);

  const opponentId = 12; // тимчасово
  const [boardSize, setBoardSize] = useState(10);

  useEffect(() => {
    fetch("/api/my-profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => setMe(data));
  }, []);

  useEffect(() => {
    fetch("/api/account", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const startGame = () => {
    if (!opponentId) return alert("Choose opponent");

    navigate("/game", {
      state: {
        me,
        opponentId,
        boardSize
      }
    });
  };

  if (!me) return <p>Loading...</p>;

  return (
    <div className="game-start-wrapper common-head">
      <h1 className="game-start-title">Start Gomoku Game</h1>

    

      <div className="section">
        <h3 className="form-text">add Friend</h3>

        <select
          className="form-input select-opponent"
          value={opponentId}
          onChange={e => setOpponentId(e.target.value)}
        >
          <option value="">-- add friend --</option>

          {users.map(u => (
            <option key={u.account_id} value={u.account_id}>
              {u.pseudo} {u.account_id === me.account_id ? "(you)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="section">
        <h3 className="form-text">Board size: <b>{boardSize} × {boardSize}</b></h3>

        <input
          type="range"
          min="10"
          max="20"
          step="1"
          value={boardSize}
          onChange={e => setBoardSize(Number(e.target.value))}
          className="form-input board-slider"
        />
      </div>

      <button className="form-button start-btn" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}

export default GameStart;
