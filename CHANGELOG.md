# Changelog

All notable changes to the Mini-RAFT project will be documented in this file.

## [2026-03-15] - WebSocket Gateway Server
### Added
- Node.js + TypeScript WebSocket gateway server on port 8080
- `BoardManager` class for in-memory board state, user registry, and broadcast
- `MessageHandler` for JSON message parsing and dispatch (join, stroke)
- `LocalRaftClient` implementing `RaftClient` interface for in-memory stroke storage
- WebSocket server with connection lifecycle (connect, join, stroke relay, disconnect)
- Lazy board creation on first join, strokes persist in memory for reconnecting users
- Broadcasting rules: join_ack to joiner, user_joined/left to others, stroke_broadcast to non-senders
- Shared `types.ts` mirroring frontend message protocol
- 29 tests across 4 suites (boardManager, messageHandler, raftClient, wsServer integration)
- `test-gateway` job added to CI pipeline

## [2026-03-15] - Frontend Drawing Board with WebSocket Client
### Added
- React + TypeScript frontend scaffolded with Vite
- Freehand drawing canvas (1920x1080 logical pixels, CSS-scaled)
- 5-color toolbar (red, blue, green, orange, purple) with active indicator
- Stroke-based logging: each mousedown→mouseup captured as array of points
- Console logging of strokes, connections, and disconnections
- WebSocket client hook with auto-reconnect (exponential backoff 1s→30s)
- Board create/join flow: home page generates 6-char code or accepts manual entry
- React Router with `/` (home) and `/board/:boardId` (drawing) routes
- `useBoard` hook wiring stroke state, WebSocket, and optimistic local rendering
- Board state replay from `join_ack` and real-time `stroke_broadcast` handling
- User identity via `sessionStorage` (persists across refresh, unique per tab)
- 38 tests across 8 suites (components, hooks, utilities)
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`)
