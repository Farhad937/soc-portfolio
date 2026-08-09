const styles: Record<string, string> = {
  published: "text-success border-success/30 bg-success/10",
  draft: "text-warning border-warning/30 bg-warning/10",
  archived: "text-text-faint border-border-strong bg-bg-raised",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${styles[status] ?? styles.archived}`}>
      {status}
    </span>
  );
}
