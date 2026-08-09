import { AlertTriangle } from "lucide-react";

export default function NotYetBacked({
  title,
  reason,
  phase,
}: {
  title: string;
  reason: string;
  phase: string;
}) {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">{title}</h1>
      <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div className="text-sm text-text-muted">
          <p className="text-text">Not editable yet — no database table backs this section.</p>
          <p className="mt-1">{reason}</p>
          <p className="mt-1 text-text-faint">Planned for: {phase}.</p>
        </div>
      </div>
    </div>
  );
}
