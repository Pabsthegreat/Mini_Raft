import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { useBoard } from '../hooks/useBoard';
import { getUserId } from '../utils/strokeUtils';
import { DEFAULT_COLOR } from '../constants';

export function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const userId = getUserId();

  if (!boardId) {
    return <Navigate to="/" replace />;
  }

  const { strokes, status, addStroke } = useBoard({ boardId, userId });
  const sessionLabel = userId.slice(0, 8);

  return (
    <main className="board-shell">
      <div className="board-topbar">
        <div className="board-heading-group">
          <span className="board-label">Board session</span>
          <h1 className="board-title">{boardId}</h1>
          <p className="board-copy">
            Draw directly on the shared surface. Local strokes feel immediate, and committed strokes stay aligned across the cluster.
          </p>
        </div>
        <aside className="board-user-chip" aria-label="Session details">
          <span className="board-user-label">Active user</span>
          <span className="board-user-value">{sessionLabel}</span>
        </aside>
      </div>

      <div className="board-grid">
        <section className="board-panel" aria-label="Board controls">
          <h2 className="panel-title">Control deck</h2>
          <p className="panel-copy">Pick your ink, keep an eye on sync health, and use the board code to bring others into the room.</p>

          <div className="metrics">
            <article className="metric-card">
              <p className="metric-label">Committed strokes</p>
              <p className="metric-value">{strokes.length}</p>
              <p className="metric-copy">Every finished line on this board, including your own optimistic updates.</p>
            </article>
            <article className="metric-card">
              <p className="metric-label">Share code</p>
              <p className="metric-value">{boardId}</p>
              <p className="metric-copy">Anyone with this code can jump into the same drawing surface.</p>
            </article>
          </div>

          <div className="toolbar-shell">
            <Toolbar activeColor={color} onColorChange={setColor} connectionStatus={status} />
          </div>
        </section>

        <Canvas
          boardId={boardId}
          userId={userId}
          color={color}
          strokes={strokes}
          onStrokeComplete={addStroke}
        />
      </div>
    </main>
  );
}
