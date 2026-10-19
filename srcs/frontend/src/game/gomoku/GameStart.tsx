import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./scss/gamestart.scss";
import { socket } from "../../jsx/messages/socket";
import { useSocketConnection } from "../../jsx/messages/hooks/useSocketConnection";
import { useTranslation } from "react-i18next";
import type { User } from "../../jsx/messages/types";

function GameStart() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- incoming data from Chat / Personal page ---
  const incomingState = location.state as { opponentId?: string; chatId?: string } | null;
  const incomingOpponentId = incomingState?.opponentId || null;
  const incomingChatId = incomingState?.chatId || null;
	const isConnected = useSocketConnection();
  const {t} = useTranslation();

  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [opponentId, setOpponentId] = useState("");
  const [chatId, setChatId] = useState("");
  const [boardSize, setBoardSize] = useState(10);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<"local" | "online">("online");
  const [invitationState, setInvitationState] = useState<'idle' | 'sending' | 'waiting' | 'declined' | 'cancelled' | 'error'>('idle');
  const [isCancellingInvitation, setIsCancellingInvitation] = useState(false);
  const [declinedByName, setDeclinedByName] = useState('');
  const invitationIdRef = useRef<string | null>(null);
  const pendingInvitationChatRef = useRef<string | null>(null);
  const earlyResponseRef = useRef<{
    event: 'accepted' | 'declined';
    payload: {
      invitationId: string;
      gameId?: string;
      boardSize?: number;
      fromUserId: string;
      toUserId: string;
    };
  } | null>(null);

  console.log(isConnected);

  // If StartGame was opened from Chat or Personal page → opponentId is preselected
  useEffect(() => {
    if (incomingOpponentId && incomingChatId) {
      setOpponentId(incomingOpponentId);
      setChatId(incomingChatId);
    }
  }, [incomingOpponentId, incomingChatId]);

  useEffect(() => {
    if (!me || !opponentId || mode !== 'online' || !isConnected) return;
    let isCurrentLookup = true;

    socket.emit(
      'game:get-pending-invitation',
      { opponentId },
      (response: {
        ok: boolean;
        data?: { invitationId: string; chatId: string; boardSize: number } | null;
      }) => {
        if (!isCurrentLookup || !response.ok || !response.data) return;
        invitationIdRef.current = response.data.invitationId;
        setChatId(response.data.chatId);
        setBoardSize(response.data.boardSize);
        setInvitationState('waiting');
      }
    );

    return () => {
      isCurrentLookup = false;
    };
  }, [me, opponentId, mode, isConnected]);

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

  const openAcceptedGame = (payload: {
    gameId: string;
    boardSize: number;
    fromUserId: string;
    toUserId: string;
  }) => {
    if (!me) return;
    const acceptedOpponentId = payload.fromUserId === me.id ? payload.toUserId : payload.fromUserId;
    navigate(`/game?gameId=${payload.gameId}&opponentId=${acceptedOpponentId}&boardSize=${payload.boardSize}`, {
      state: {
        gameId: payload.gameId,
        boardSize: payload.boardSize,
        me,
        opponentId: acceptedOpponentId,
        mode: "online",
      },
    });
  };

  const handleInvitationDeclined = (payload: { invitationId: string; fromUserId: string; toUserId: string }) => {
    if (payload.invitationId !== invitationIdRef.current || payload.fromUserId !== me?.id) return;
    const declinedUser = users.find((user) => user.id === payload.toUserId);
    setDeclinedByName(declinedUser?.pseudo ?? t('game.opponent'));
    setInvitationState('declined');
    invitationIdRef.current = null;
  };

  useEffect(() => {
    if (!me) return;

    const handleAccepted = (payload: {
      invitationId: string;
      gameId: string;
      boardSize: number;
      fromUserId: string;
      toUserId: string;
    }) => {
      if (payload.fromUserId === me.id) {
        if (payload.invitationId === invitationIdRef.current) openAcceptedGame(payload);
        else if (!invitationIdRef.current) earlyResponseRef.current = { event: 'accepted', payload };
        return;
      }
      if (payload.toUserId === me.id) openAcceptedGame(payload);
    };

    const handleDeclined = (payload: { invitationId: string; fromUserId: string; toUserId: string }) => {
      if (payload.fromUserId !== me.id) return;
      if (payload.invitationId === invitationIdRef.current) handleInvitationDeclined(payload);
      else if (!invitationIdRef.current) earlyResponseRef.current = { event: 'declined', payload };
    };

    const handleInvitationCreated = ({ invitationId, chatId }: { invitationId: string; chatId: string }) => {
      if (chatId !== pendingInvitationChatRef.current) return;
      invitationIdRef.current = invitationId;
      pendingInvitationChatRef.current = null;
      setInvitationState('waiting');

      const earlyResponse = earlyResponseRef.current;
      if (!earlyResponse) return;
      earlyResponseRef.current = null;
      if (earlyResponse.payload.invitationId !== invitationId) return;
      if (earlyResponse.event === 'accepted' && earlyResponse.payload.gameId && earlyResponse.payload.boardSize) {
        openAcceptedGame(earlyResponse.payload as {
          gameId: string;
          boardSize: number;
          fromUserId: string;
          toUserId: string;
        });
      } else if (earlyResponse.event === 'declined') {
        handleInvitationDeclined(earlyResponse.payload);
      }
    };

    const handleInvitationCancelled = ({ invitationId }: { invitationId: string }) => {
      if (invitationId !== invitationIdRef.current) return;
      invitationIdRef.current = null;
      setInvitationState('cancelled');
      setIsCancellingInvitation(false);
    };

    socket.on("game:accepted", handleAccepted);
    socket.on("game:declined", handleDeclined);
    socket.on("game:invitation-created", handleInvitationCreated);
    socket.on("game:cancelled", handleInvitationCancelled);

    return () => {
      socket.off("game:accepted", handleAccepted);
      socket.off("game:declined", handleDeclined);
      socket.off("game:invitation-created", handleInvitationCreated);
      socket.off("game:cancelled", handleInvitationCancelled);
    };
  }, [me, navigate, users, t]);



  async function getOrCreateChatId(meId: string, opponentId: string) {
      const res = await fetch(`/api/chat/find?user1=${meId}&user2=${opponentId}`, {
        credentials: "include"
      });
    
      const data = await res.json();
    
      if (data?.chatId) return data.chatId;
    
      // If no chat exists → create one
      const createRes = await fetch(`/api/chat/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1: meId, user2: opponentId })
      });
    
      const createData = await createRes.json();
      return createData.chatId;
    }

  


  const handleSendInvitation = async () => {
    if (!me || !isConnected) {
      setInvitationState('error');
      return;
    }

    const finalChatId = chatId || await getOrCreateChatId(me.id, opponentId);

    setChatId(finalChatId);
   
      const msg = {
        id: crypto.randomUUID(),
        chatId: finalChatId,
        recipientId: opponentId,
        sender: { id: me.id, profilePhoto: me.profilePhoto },
        type: "invitation",
        content: `${boardSize}`
      };

    setInvitationState('sending');
    invitationIdRef.current = null;
    pendingInvitationChatRef.current = finalChatId;
    earlyResponseRef.current = null;
    socket.emit("new-chat-message", msg, (response: { ok: boolean }) => {
      if (response.ok) return;
      pendingInvitationChatRef.current = null;
      setInvitationState('error');
    });
    };

  const cancelInvitation = () => {
    if (!invitationIdRef.current || isCancellingInvitation) return;
    setIsCancellingInvitation(true);
    socket.emit(
      'game:cancel-invitation',
      { invitationId: invitationIdRef.current },
      (response: { ok: boolean }) => {
        if (!response.ok) setIsCancellingInvitation(false);
      }
    );
  };

  

  const startGame = async () => {
    if (!me) return;
    if (mode === 'local')
        setOpponentId(me.id);
    if (!opponentId) {
      setError(true);
      return;
    }

    setError(false);

    // LOCAL MODE → go directly to game
    if (mode === "local") {

      navigate("/game", {
        state: { me, opponentId, boardSize, mode, }
      });
      return;
    }

    // ONLINE MODE → send invite
    if (mode === "online") {
      setDeclinedByName('');
      await handleSendInvitation();
    }
  };

  if (!me) return <p>{t('common.loading')}</p>;

  return (
    <div className="game-start-wrapper common-head">
      <h1 className="game-start-title">{t('game.start_gomoku_game')}</h1>

      {/* Game mode */}

      <div className="section">
        <h3 className="form-text">{t('game.game_mode')}</h3>

        <select
          className="form-input"
          value={mode}
          onChange={e => {setMode(e.target.value as "online" | "local")
            setOpponentId(e.target.value === "local" ? "me.id" : "")
          }}
        >
          <option value="online">{t('game.play_online')}</option>
          <option value="local">{t('game.play_local')}</option>
        </select>
      </div>

      {/* Opponent selection */}

      {mode === 'online' && <div className="section">
        <h3 className="form-text">{t('game.choose_opponent')}</h3>

        <select
          className={`form-input select-opponent ${error ? "error-frame" : ""}`}
          value={opponentId}
          disabled={invitationState === 'sending' || invitationState === 'waiting'}
          onChange={e => {
            setOpponentId(e.target.value);
            setError(false);
          }}
        >
          <option value="">{t('game.select_opponent')}</option>

          {users
            .filter(u => u.id !== me.id)
            .map(u => (
              <option key={u.id} value={u.id}>
                {u.pseudo}
              </option>
            ))}
        </select>
      </div>}

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
          disabled={invitationState === 'sending' || invitationState === 'waiting'}
          onChange={e => setBoardSize(Number(e.target.value))}
          className="form-input board-slider"
        />
      </div>

      {/* Start button */}
      <button
        className="form-button start-btn"
        onClick={startGame}
        disabled={invitationState === 'sending' || invitationState === 'waiting'}
      >
        {t('game.send_invite')}
      </button>
      {invitationState === 'sending' && <p role="status">{t('game.invitation_sending')}</p>}
      {invitationState === 'waiting' && <p role="status">{t('game.invitation_waiting')}</p>}
      {invitationState === 'declined' && <p role="status">{t('game.invitation_declined', { user: declinedByName })}</p>}
      {invitationState === 'cancelled' && <p role="status">{t('game.invitation_cancelled')}</p>}
      {invitationState === 'error' && <p role="alert">{t('game.invitation_send_error')}</p>}
      {invitationState === 'waiting' && (
        <button className="form-button" onClick={cancelInvitation} disabled={isCancellingInvitation}>
          {isCancellingInvitation
            ? t('game.invitation_cancelling')
            : t('game.cancel_invitation')}
        </button>
      )}
    </div>
  );
}

export default GameStart;
