import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Gomoku from "./gomoku";
import { useSocketConnection } from "../../jsx/messages/hooks/useSocketConnection";
import type { User } from "../../jsx/messages/types";

type GameRouteState = {
  gameId?: string;
  opponentId?: string;
  boardSize?: number;
  mode?: string;
  me?: User;
};

function GamePage() {
  const { state: routeState } = useLocation();
  const state = (routeState ?? {}) as GameRouteState;
  const [searchParams] = useSearchParams();
  const gameId = state.gameId ?? searchParams.get('gameId') ?? undefined;
  const opponentId = state.opponentId ?? searchParams.get('opponentId') ?? undefined;
  const boardSize = state.boardSize ?? Number(searchParams.get('boardSize'));
  const mode = state.mode ?? (gameId ? 'online' : 'local');
  const [loadedMe, setLoadedMe] = useState<User | null>(null);
  const me = state.me ?? loadedMe;
  const isConnected = useSocketConnection(mode === "online");

  const [opponent, setOpponent] = useState<User | null>(null);

  useEffect(() => {
    if (state.me) return;
    fetch('/api/my-profile', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setLoadedMe(data))
      .catch((err) => console.error('my-profile error:', err));
  }, [state.me]);

  useEffect(() => {
    if (!opponentId) return;
    fetch(`/api/user/${opponentId}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setOpponent(data))
      .catch(err => console.error("users error:", err));
  }, [opponentId]);
  
  if (!opponent || !me || (mode === 'online' && !gameId)) return <p>Loading game...</p>;


  const playersData = [
    {
      id: me.id,
      username: me.pseudo,
      profilePhoto: me.profilePhoto.name,
      symbol: "X"
    },
    {
      id: opponent.id,
      username: opponent.pseudo,
      profilePhoto: opponent.profilePhoto.name,
      symbol: "O"
    }
  ];

  return (
    <Gomoku
      playersData={playersData}
      boardSize={boardSize}
      mode={mode}
      gameId={gameId}
      myUserId={me.id}
      isConnected={isConnected}
    />
  );
}

export default GamePage;
