export interface Stat {
  readonly value: string;
  readonly label: string;
}

interface StatsProps {
  readonly stats: readonly Stat[];
}

export function Stats({ stats }: StatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <dt className="order-2 text-muted-foreground text-sm">{stat.label}</dt>
          <dd className="order-1 font-mono font-semibold text-3xl tracking-tight sm:text-4xl">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
