import { COLORS } from '../constants';
import type { ConnectionStatus } from '../hooks/useWebSocket';

interface ToolbarProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  connectionStatus: ConnectionStatus;
}

export function Toolbar({ activeColor, onColorChange, connectionStatus }: ToolbarProps) {
  const statusText =
    connectionStatus === 'connected'
      ? 'Connected'
      : connectionStatus === 'connecting'
        ? 'Connecting...'
        : 'Disconnected';

  const statusColor =
    connectionStatus === 'connected'
      ? '#1f9d63'
      : connectionStatus === 'connecting'
        ? '#d98324'
        : '#d64545';

  return (
    <div data-testid="toolbar">
      <div className="toolbar-label-row">
        <span className="toolbar-label">Ink palette</span>
        <span className="status-pill" data-testid="connection-status" style={{ color: statusColor }}>
          {statusText}
        </span>
      </div>

      <div className="toolbar-colors">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`color-button${activeColor === color ? ' color-button-active' : ''}`}
            data-testid={`color-${color}`}
            onClick={() => onColorChange(color)}
            aria-label={`Select color ${color}`}
            style={{
              backgroundColor: color,
              border: activeColor === color ? '3px solid #14213D' : '3px solid transparent',
              outline: activeColor === color ? '2px solid rgba(20, 33, 61, 0.28)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
