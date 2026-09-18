import { Logo } from "@/components/layout/logo";

export function ListsEmpty({ query }: { query: string }) {
  if (query) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-card px-10 py-11 text-center">
        <div className="font-display text-[21px] font-semibold tracking-[-0.01em]">
          Ничего не найдено
        </div>
        <p className="max-w-[42ch] text-body-l leading-[1.55] text-muted-foreground">
          По запросу «{query}» совпадений нет. Попробуйте короче или создайте новый список с таким
          названием.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3.5 rounded-lg border-[1.5px] border-dashed border-border bg-card px-10 py-13 text-center">
      <Logo className="mb-1.5 opacity-60" />
      <div className="font-display text-[23px] font-semibold tracking-[-0.01em]">
        Пока ни одного списка
      </div>
      <p className="max-w-[44ch] text-body-l leading-[1.55] text-muted-foreground">
        Создайте первый список — например «Релиз» или «Домашние дела». Задачи и дедлайны добавите
        внутри.
      </p>
    </div>
  );
}
