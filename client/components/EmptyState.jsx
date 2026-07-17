import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "surface flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
