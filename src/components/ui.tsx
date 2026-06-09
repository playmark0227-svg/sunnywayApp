import { campaignStatusStyle, appStatusStyle, campaignStatusLabel, applicationStatusLabel } from "@/lib/labels";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="display text-3xl font-semibold text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="card p-6">
      <div className="text-xs font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className="display mt-2 text-3xl font-semibold text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function CampaignBadge({ status }: { status: string }) {
  return <span className={`badge ${campaignStatusStyle[status]}`}>{campaignStatusLabel[status]}</span>;
}
export function AppBadge({ status }: { status: string }) {
  return <span className={`badge ${appStatusStyle[status]}`}>{applicationStatusLabel[status]}</span>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="card flex flex-col items-center justify-center gap-2 p-12 text-center text-sm text-muted">{children}</div>;
}
