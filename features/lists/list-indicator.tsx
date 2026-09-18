import type { ListStats } from "@/domain/list-stats";
import { Badge } from "@/components/ui/badge";

type BadgeTone = React.ComponentProps<typeof Badge>["variant"];

function getIndicatorContent(stats: ListStats, now: Date): { tone: BadgeTone; label: string } {
  if (stats.indicator === "overdue") {
    return { tone: "overdue", label: `▲ Просрочено ${stats.counters.overdue}` };
  }

  if (stats.indicator === "soon" && stats.nearestDueAt) {
    const hours = Math.max(
      1,
      Math.round((stats.nearestDueAt.getTime() - now.getTime()) / 3_600_000),
    );

    return { tone: "warning", label: `◗ Дедлайн через ${hours} ч` };
  }

  if (stats.indicator === "complete") {
    return { tone: "success", label: "✓ Всё закрыто" };
  }

  return { tone: "neutral", label: "◦ В графике" };
}

export function ListIndicator({ stats, now }: { stats: ListStats; now: Date }) {
  const { tone, label } = getIndicatorContent(stats, now);

  return <Badge variant={tone}>{label}</Badge>;
}
