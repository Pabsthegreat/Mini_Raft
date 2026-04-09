import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateBoardCode } from '../utils/strokeUtils';

export function BoardJoin() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    const boardCode = generateBoardCode();
    navigate(`/board/${boardCode}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toLowerCase();
    if (trimmed.length > 0) {
      navigate(`/board/${trimmed}`);
    }
  };

  return (
    <main className="home-shell">
      <div className="home-layout">
        <section className="home-hero" aria-label="Product introduction">
          <span className="eyebrow">Mini-RAFT live sync</span>
          <h1 className="hero-title">Distributed drawing without the dashboard noise.</h1>
          <p className="hero-copy">
            A shared whiteboard with a clean workspace, fast board codes, and a backend that keeps every committed stroke in step.
          </p>
          <div className="hero-grid" aria-label="Product highlights">
            <article className="hero-card">
              <p className="hero-card-label">Experience</p>
              <p className="hero-card-value">Canvas-first, distraction-light</p>
            </article>
            <article className="hero-card">
              <p className="hero-card-label">Sync</p>
              <p className="hero-card-value">Gateway + RAFT-backed replicas</p>
            </article>
            <article className="hero-card">
              <p className="hero-card-label">Boards</p>
              <p className="hero-card-value">Join instantly with a 6-char code</p>
            </article>
          </div>
        </section>

        <section className="join-card" data-testid="board-join">
          <p className="join-kicker">Enter the workspace</p>
          <h2 className="join-title">Open a fresh board or jump into an existing room.</h2>
          <p className="join-copy">
            Keep the entry simple: create a new session in one click, or type a board code to continue a collaborative sketch.
          </p>

          <button className="primary-button" data-testid="create-board" onClick={handleCreate}>
            Create Board
          </button>

          <div className="join-divider">or join by code</div>

          <form className="join-form" onSubmit={handleJoin}>
            <label className="join-field-label" htmlFor="board-code-input">
              Board code
            </label>
            <div className="join-field-row">
              <input
                className="join-input"
                data-testid="board-code-input"
                id="board-code-input"
                type="text"
                placeholder="Enter board code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="secondary-button" data-testid="join-board" type="submit">
                Join
              </button>
            </div>
          </form>

          <p className="join-hint">Share the code with teammates and start drawing in the same space right away.</p>
        </section>
      </div>
    </main>
  );
}
