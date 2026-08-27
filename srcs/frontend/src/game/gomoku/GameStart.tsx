import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/gamestart.scss";

function GameStart() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [opponentId, setOpponentId] = useState("");   // додано
  const [boardSize, setBoardSize] = useState(10);

  // --- Завантаження мого профілю ---
  useEffect(() => {
    fetch("/api/my-profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => setMe(data))
      .catch(err => console.error("my-profile error:", err));
  }, []);

  // --- Завантаження всіх користувачів ---
  useEffect(() => {
    fetch("/api/users", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("users error:", err));
  }, []);

  const startGame = () => {
    if (!opponentId) {
      alert("Оберіть друга для гри");
      return;
    }

    navigate("/game", {
      state: {
        me,
        opponentId,
        boardSize,
      },
    });
  };

  if (!me) return <p>Loading...</p>;

  return (
    <div className="game-start-wrapper common-head">
      <h1 className="game-start-title">Start Gomoku Game</h1>

      {/* Вибір друга */}
      <div className="section">
        <h3 className="form-text">Додати друга</h3>

        <select
          className="form-input select-opponent"
          value={opponentId}
          onChange={e => setOpponentId(e.target.value)}
        >
          <option value="">-- оберіть друга --</option>

          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.pseudo} {u.id === me.id ? "(ви)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Розмір дошки */}
      <div className="section">
        <h3 className="form-text">
          Розмір дошки: <b>{boardSize} × {boardSize}</b>
        </h3>

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
