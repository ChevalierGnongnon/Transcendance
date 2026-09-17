import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./scss/gamestart.scss";
import { socket } from "../../jsx/messages/socket";
import { useSocketConnection } from "../../jsx/messages/hooks/useSocketConnection";

function GameStart() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- incoming opponentId from Chat / Personal page ---
  const incomingOpponentId = location.state?.opponentId || null;
  const incomingChatId = location.state?.chatId || null;
	const isConnected = useSocketConnection();

  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [opponentId, setOpponentId] = useState("");
  const [chatId, setChatId] = useState("");
  const [boardSize, setBoardSize] = useState(10);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("local"); // "local" | "online"

  // If StartGame was opened from Chat or Personal page → opponentId is preselected
  useEffect(() => {
    if (incomingOpponentId && incomingChatId) {
      setOpponentId(incomingOpponentId);
      setChatId(incomingChatId);
    }
  }, [incomingOpponentId, incomingChatId]);

  // --- homeUser profile ---
  useEffect(() => {
    fetch("/api/my-profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => setMe(data))
      .catch(err => console.error("my-profile error:", err));
  }, []);

  // --- guestUser profile ---
  useEffect(() => {
    fetch("/api/users", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("users error:", err));
  }, []);

  const handleSendMessage = () => {

      const msg = {
        chatId: '8cbad2be-da73-47f0-b39a-8d7f41b65ab4',
        recipientId: '28a4dbd9-50e0-4fe6-bef3-dc4a08071300',
        sender: { id: me.id, profilePhoto: { name: me.profilePhoto.name } },
        type: "text",
        content: ''
      };

      socket.emit("new-chat-message", msg);
    };

  const startGame = () => {
    if (!opponentId) {
      setError(true);
      return;
    }

    setError(false);

    // LOCAL MODE → go directly to game
    if (mode === "local") {
      navigate("/game", {
        state: { me, opponentId, boardSize, mode,  }
      });
      return;
    }

    // ONLINE MODE → send invite (structure only, logic later)
    if (mode === "online") {
      // here later you will emit socket.io event:
      // socket.emit("game:invite", { fromUserId: me.id, toUserId: opponentId, boardSize, mode });
      handleSendMessage();
      // For now just redirect to chat where opponent will accept invite
      // navigate("/chat", {
      //   state: {
      //     invite: {
      //       fromUserId: me.id,
      //       toUserId: opponentId,
      //       boardSize,
      //       mode
      //     }
      //   }
      // });
    }
  };

  if (!me) return <p>Loading...</p>;

  return (
    <div className="game-start-wrapper common-head">
      <h1 className="game-start-title">Start Gomoku Game</h1>

      {/* Opponent selection */}
      <div className="section">
        <h3 className="form-text">Choose opponent</h3>

        <select
          className={`form-input select-opponent ${error ? "error-frame" : ""}`}
          value={opponentId}
          onChange={e => {
            setOpponentId(e.target.value);
            setError(false);
          }}
        >
          <option value="">-- select opponent --</option>

          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.pseudo} {u.id === me.id ? "(you)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Game mode */}
      <div className="section">
        <h3 className="form-text">Game mode</h3>

        <select
          className="form-input"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="local">Play local (same computer)</option>
          <option value="online">Play online (invite opponent)</option>
        </select>
      </div>

      {/* Board size */}
      <div className="section">
        <h3 className="form-text">
          Table size: <b>{boardSize} × {boardSize}</b>
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

      {/* Start button */}
      <button className="form-button start-btn" onClick={startGame}>
        Send invite
      </button>
    </div>
  );
}

export default GameStart;
