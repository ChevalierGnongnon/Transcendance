import { socket } from "./socket";

function GameInviteMessage({ invite, me }) {
  const isMe = invite.fromUserId === me.id;

  return (
    <div className="game-invite-box">
      <p>
        {isMe
          ? "You invited opponent to play Gomoku"
          : `${invite.fromUserName} invites you to play Gomoku`}
      </p>

      <p>Board size: {invite.boardSize}</p>
      <p>Mode: {invite.mode}</p>

      {!isMe && (
        <div className="invite-actions">
          <button
            className="btn btn-success"
            onClick={() => socket.emit("game:accept", invite)}
          >
            Accept
          </button>

          <button
            className="btn btn-danger"
            onClick={() => socket.emit("game:decline", invite)}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

export default GameInviteMessage;
