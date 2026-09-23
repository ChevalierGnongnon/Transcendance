import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./scss/gamestart.scss";
import { socket } from "../../jsx/messages/socket";
import { useSocketConnection } from "../../jsx/messages/hooks/useSocketConnection";
import { useTranslation } from "react-i18next";

function GameStart() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- incoming data from Chat / Personal page ---
  const incomingOpponentId = location.state?.opponentId || null;
  const incomingChatId = location.state?.chatId || null;
	const isConnected = useSocketConnection();
  const {t} = useTranslation();

  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [opponentId, setOpponentId] = useState("");
  const [chatId, setChatId] = useState("");
  const [boardSize, setBoardSize] = useState(10);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("local"); // "local" | "online"

  console.log(isConnected);

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

  const handleSendInvitation = () => {

      const msg = {
        chatId: chatId,
        recipientId: opponentId,
        sender: { id: me.id, profilePhoto: { name: me.profilePhoto.name } },
        type: "invitation",
        content: `${gameId}:${boardSize}`   /////
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

    // ONLINE MODE → send invite
    if (mode === "online") {

     
      handleSendInvitation();
     
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

      useEffect(() => {
          const handleAccepted = ({ gameId, answer }) => {
            if (answer === "accept") {
              //handle accept
               navigate("/game", {
                state: {
                  me,
                  opponentId,
                  boardSize: invite.boardSize,
                  mode: invite.mode,
                  gameId
              }
            });
            } 
            else {
              // handle decline
            }     
           
          };
      
          socket.on("game:invite_answer", handleAccepted);
          return () => socket.off("game:accepted", handleAccepted);
        }, [navigate, me]);
      
        // Handle invite decline → system message
        useEffect(() => {
          const handleDeclined = ({ invite }) => {
            roomProps.onAddMessage({
              id: Date.now(),
              chatId,
              type: "system",
              sender: { id: 0, profilePhoto: { name: "system.png" } },
              content: `${invite.toUserName} declined the game invite.`
            });
          };
      
          socket.on("game:decline", handleDeclined);
          return () => socket.off("game:decline", handleDeclined);
        }, [chatId]);

    }
  };

  if (!me) return <p>{t('common.loading')}</p>;

  return (
    <div className="game-start-wrapper common-head">
      <h1 className="game-start-title">{t('game.start_gomoku_game')}</h1>

      {/* Opponent selection */}
  
      <div className="section">
        <h3 className="form-text">{t('game.choose_opponent')}</h3>

        <select
          className={`form-input select-opponent ${error ? "error-frame" : ""}`}
          value={opponentId}
          onChange={e => {
            setOpponentId(e.target.value);
            setError(false);
          }}
        >
          <option value="">{t('game.select_opponent')}</option>

          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.pseudo} {u.id === me.id ? "(you)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Game mode */}
      <div className="section">
        <h3 className="form-text">{t('game.game_mode')}</h3>

        <select
          className="form-input"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="local">{t('game.play_local')}</option>
          <option value="online">{t('game.play_online')}</option>
        </select>
      </div>

      {/* Board size */}
      <div className="section">
        <h3 className="form-text">
          {t('game.table_size')} <b>{boardSize} × {boardSize}</b>
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
        {t('game.send_invite')}
      </button>
    </div>
  );
}

export default GameStart;
