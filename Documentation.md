# Mini-RAFT — Distributed Real-Time Drawing Board

## Overview

A distributed real-time collaborative drawing board backed by a Mini-RAFT consensus protocol. The system consists of a WebSocket gateway, three replica nodes implementing RAFT-lite consensus, and a browser-based drawing canvas.

---

## Frontend Client — Drawing Board with WebSocket

### What it does

A React-based collaborative drawing board where users can create or join boards via a unique 6-character code, draw freehand strokes with 5 selectable colors, and connect to the gateway over WebSocket for real-time synchronization.

### How it works

- **Tech stack**: Vite + React 18 + TypeScript, React Router v6, Vitest + Testing Library
- **Canvas**: Fixed 1920x1080 logical pixel canvas, CSS-scaled to fit viewport. Strokes are drawn as polylines sampled at pointer event rate (~60fps).
- **Stroke format**: Each completed stroke (mousedown→mouseup) is captured as an array of `[x, y]` points with metadata (board ID, user ID, color, brush width, timestamp, UUID).
- **WebSocket**: One connection per user per board. URL format: `ws://gateway:8080/ws?boardId=<code>&userId=<uuid>`. Auto-reconnects with exponential backoff (1s → 30s max).
- **Optimistic drawing**: Local strokes render immediately on canvas and are sent to the server simultaneously. Remote strokes arrive via `stroke_broadcast` messages.
- **Board state**: On join, the server sends a `join_ack` with all existing strokes, which are replayed on the canvas.
- **User identity**: `userId` is stored in `sessionStorage` (persists across refresh, unique per tab).

### URL Routes

| Route | Description |
|-------|-------------|
| `/` | Home page — create a new board or enter a board code to join |
| `/board/:boardId` | Drawing board — canvas, toolbar, WebSocket connection |

### WebSocket Message Protocol

| Direction | Type | Purpose |
|-----------|------|---------|
| Client→Server | `join` | Join a board |
| Client→Server | `stroke` | Submit completed stroke |
| Server→Client | `join_ack` | Confirm join + full board state |
| Server→Client | `stroke_broadcast` | New stroke from another user |
| Server→Client | `user_joined` / `user_left` | Presence updates |
| Server→Client | `error` | Error message |

### Console Logging

Strokes are logged to the browser console in this format:
```
[timestamp] STROKE board=room-abc user=user-xyz color=#E74C3C points=47 from=(120,45) to=(402,310)
```

Connection and disconnection events are also logged.

### Configuration

- **WS URL**: Set `VITE_WS_URL` environment variable (default: `ws://localhost:8080/ws`)
- **Colors**: Red (#E74C3C), Blue (#3498DB), Green (#2ECC71), Orange (#F39C12), Purple (#9B59B6)
- **Brush width**: 3px
- **Canvas size**: 1920x1080 logical pixels

### Running

```bash
cd frontend
npm install
npm run dev    # Development server at http://localhost:5173
npm test       # Run all tests
npm run build  # Production build
```

---

## WebSocket Gateway Server

### What it does

A Node.js + TypeScript WebSocket gateway that accepts client connections, manages in-memory board state, tracks connected users per board, and broadcasts strokes between clients in real time. Boards are created lazily on first join and persist strokes in memory for reconnecting users.

### How it works

- **Tech stack**: Node.js, TypeScript, `ws` library, Vitest
- **WebSocket endpoint**: `ws://localhost:8080/ws?boardId=<code>&userId=<uuid>`
- **Board management**: Boards are stored in a `Map<string, Board>` keyed by board ID. Each board holds an array of strokes and a map of connected users (userId → WebSocket).
- **Connection lifecycle**: On connect, `boardId` and `userId` are extracted from query params. On `join` message, the user is registered and receives a `join_ack` with all existing strokes. On disconnect, a `user_left` message is broadcast to remaining users.
- **Stroke relay**: Incoming strokes are stored in the board's stroke array and broadcast to all other users on the board (not echoed to the sender, since the frontend uses optimistic rendering).
- **RAFT preparation**: A `RaftClient` interface abstracts stroke storage. Currently implemented as `LocalRaftClient` (in-memory via BoardManager). Will be swapped for `RemoteRaftClient` when RAFT replicas are added.

### Broadcasting Rules

| Message | Recipients |
|---------|-----------|
| `join_ack` | Only the joining user |
| `user_joined` | All on board EXCEPT the joiner |
| `stroke_broadcast` | All on board EXCEPT the stroke author |
| `user_left` | All remaining users on board |
| `error` | Only the offending client |

### Architecture

```
gateway/
├── src/
│   ├── index.ts            # HTTP server + WS server on port 8080
│   ├── types.ts             # Shared message protocol types
│   ├── boardManager.ts      # Board state, user registry, broadcast helper
│   ├── messageHandler.ts    # JSON parse, dispatch to board manager
│   ├── wsServer.ts          # WebSocket server setup, connection lifecycle
│   └── raftClient.ts        # RAFT interface + LocalRaftClient (no-op for now)
```

### Configuration

- **Port**: Set `PORT` environment variable (default: `8080`)

### Running

```bash
cd gateway
npm install
npm run dev    # Development server on port 8080
npm test       # Run all tests (29 tests across 4 suites)
npm run build  # TypeScript compilation
```
