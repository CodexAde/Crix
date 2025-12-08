import { clsx } from 'clsx';

export function StatCard({ title, value, subtitle, icon: Icon, className }) {
  return (
    <div className={clsx("bg-card p-6 rounded-[1.5rem] shadow-soft border border-border-soft", className)}>
      <div className="flex items-start justify-between">
        <div>
           <p className="text-sm font-medium text-secondary mb-1">{title}</p>
           <h3 className="text-2xl font-bold text-primary">{value}</h3>
           {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
        </div>
        {Icon && (
            <div className="p-3 bg-border-soft rounded-2xl text-accent">
                <Icon className="w-6 h-6" />
            </div>
        )}
      </div>
    </div>
  );
}
