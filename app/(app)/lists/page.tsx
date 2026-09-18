import { ListCard } from "@/features/lists/list-card";
import { ListsEmpty } from "@/features/lists/lists-empty";
import { ListsSearch } from "@/features/lists/lists-search";
import { getLists, getListsSummary } from "@/features/lists/queries";
import { formatLists, formatOverdue, formatTasks } from "@/lib/format";

export default async function ListsPage({ searchParams }: PageProps<"/lists">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  const [lists, summary] = await Promise.all([getLists(query), getListsSummary()]);
  const now = new Date();

  return (
    <div className="px-4 py-8 sm:px-10 sm:pb-10">
      <div className="mb-6 flex flex-col gap-4 sm:mb-[26px] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold tracking-[-0.02em] sm:text-display-l">
            Списки
          </h1>
          <div className="mt-1.5 font-mono text-[11.5px] tracking-[0.12em] text-muted-foreground uppercase">
            {formatLists(summary.lists)} · {formatTasks(summary.tasks)} ·{" "}
            {formatOverdue(summary.overdue)}
          </div>
        </div>

        <ListsSearch />
      </div>

      {lists.length === 0 ? (
        <ListsEmpty query={query} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} now={now} />
          ))}
        </div>
      )}
    </div>
  );
}
