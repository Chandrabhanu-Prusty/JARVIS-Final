export type ComponentState = "ready" | "error" | "unknown" | "active";

type StatusItem = { label: string; state: ComponentState };

type SystemStatusProps = { items: StatusItem[] };

const stateLabel: Record<ComponentState, string> = {
  ready: "READY",
  active: "ACTIVE",
  error: "ERROR",
  unknown: "UNCHECKED",
};

export function SystemStatus({ items }: SystemStatusProps) {
  return (
    <aside className="system-status" aria-label="System status">
      <p className="status-title">SYSTEM STATUS</p>
      {items.map((item) => (
        <div className="status-row" key={item.label}>
          <span>{item.label}</span>
          <span className={`status-light ${item.state}`} title={stateLabel[item.state]} />
        </div>
      ))}
      <p className="status-key"><i className="status-light ready" /> ready <i className="status-light error" /> error</p>
    </aside>
  );
}
