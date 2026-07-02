import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getRoundState(board) {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, isDraw: false };
    }
  }

  return { winner: null, line: [], isDraw: board.every(Boolean) };
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [lastWinner, setLastWinner] = useState(null);

  const roundState = useMemo(() => getRoundState(board), [board]);
  const gameOver = roundState.winner || roundState.isDraw;

  const statusText = roundState.winner
    ? `Player ${roundState.winner} lights up the grid!`
    : roundState.isDraw
      ? 'Draw! The neon grid stays balanced.'
      : `Player ${currentPlayer}, choose your glow.`;

  function playCell(index) {
    if (board[index] || gameOver) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextState = getRoundState(nextBoard);
    setBoard(nextBoard);

    if (nextState.winner) {
      setScores((currentScores) => ({
        ...currentScores,
        [nextState.winner]: currentScores[nextState.winner] + 1,
      }));
      setLastWinner(nextState.winner);
      return;
    }

    if (nextState.isDraw) {
      setScores((currentScores) => ({
        ...currentScores,
        draws: currentScores.draws + 1,
      }));
      setLastWinner('draw');
      return;
    }

    setCurrentPlayer((player) => (player === 'X' ? 'O' : 'X'));
  }

  function resetRound() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(lastWinner && lastWinner !== 'draw' ? (lastWinner === 'X' ? 'O' : 'X') : 'X');
    setLastWinner(null);
  }

  function resetAll() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setScores({ X: 0, O: 0, draws: 0 });
    setLastWinner(null);
  }

  return (
    <main className="app-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <section className="game-card">
        <div className="hero-copy">
          <p className="eyebrow">Arcade classic · modern glow</p>
          <h1>Neon Tic Tac Toe</h1>
          <p className="subtitle">Claim three tiles in a row before your rival takes over the cyber grid.</p>
        </div>

        <div className="scoreboard" aria-label="Scoreboard">
          <div className="score-pill x-score">
            <span>Player X</span>
            <strong>{scores.X}</strong>
          </div>
          <div className="score-pill draw-score">
            <span>Draws</span>
            <strong>{scores.draws}</strong>
          </div>
          <div className="score-pill o-score">
            <span>Player O</span>
            <strong>{scores.O}</strong>
          </div>
        </div>

        <div className="status-panel">
          <span className={`turn-chip player-${currentPlayer.toLowerCase()}`}>{gameOver ? 'Round over' : `${currentPlayer} turn`}</span>
          <p>{statusText}</p>
        </div>

        <div className="board" role="grid" aria-label="Tic tac toe board">
          {board.map((value, index) => {
            const isWinningCell = roundState.line.includes(index);
            return (
              <button
                className={`cell ${value ? `filled player-${value.toLowerCase()}` : ''} ${isWinningCell ? 'winner' : ''}`}
                type="button"
                key={index}
                onClick={() => playCell(index)}
                aria-label={`Cell ${index + 1}${value ? ` occupied by ${value}` : ''}`}
              >
                <span>{value}</span>
              </button>
            );
          })}
        </div>

        <div className="actions">
          <button className="primary-action" type="button" onClick={resetRound}>New round</button>
          <button className="secondary-action" type="button" onClick={resetAll}>Reset scores</button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
