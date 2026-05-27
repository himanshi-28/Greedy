import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-dashed border-black/10 bg-white p-6 text-center shadow-panel dark:border-white/10">
      {Icon && (
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-ocean/10 text-ocean">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h2 className="mt-4 text-2xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60 dark:text-white/60">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}
