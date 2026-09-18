# Стопка

Таск-менеджер на Next.js: списки задач, дедлайны, приоритеты и статусы.

**Стек:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, react-hook-form + Zod, Vitest 5, Storybook 10.

## Запуск

Нужны Node.js 24 и pnpm 10.

```bash
pnpm install
pnpm dev
```

Приложение откроется на http://localhost:3000.

Никакой настройки не требуется: данные живут в памяти процесса и заполняются при старте. Переменные окружения необязательны — список и значения по умолчанию в [`.env.example`](.env.example).

| Переменная        | По умолчанию                                | Назначение                                                              |
| ----------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `AUTH_EMAIL`      | `admin@example.com`                         | логин                                                                   |
| `AUTH_PASSWORD`   | `Admin123!`                                 | пароль                                                                  |
| `DATA_LATENCY_MS` | `350` в разработке, `0` в остальных режимах | искусственная задержка слоя данных, чтобы были видны состояния загрузки |

## Тесты

```bash
pnpm test            # юнит-тесты и Storybook-истории одной командой
pnpm test:watch      # то же в режиме наблюдения
pnpm storybook       # Storybook на http://localhost:6006
```

`pnpm test` запускает два проекта Vitest:

- **`unit`** — в Node. Доменная логика, форматирование, слой данных, проверка учётных данных. 93 теста.
- **`storybook`** — в headless Chromium через Playwright. Истории с `play`-функциями и проверкой доступности axe: любое нарушение роняет тест. 9 историй.

Перед первым запуском Storybook-тестов нужен браузер Playwright:

```bash
pnpm exec playwright install chromium
```

## Слой данных

Компоненты не знают, откуда приходят данные. Чтение и запись идут только через сервер.

```
Чтение   RSC-страница → features/*/queries.ts → server/db (репозиторий)
Запись   Server Action → проверка Zod → server/db → revalidatePath
```

## Структура

```
app/                  маршруты: вход, списки, список задач, 404, ошибки
domain/               правила предметной области — без React и Next, покрыты тестами
server/db/            репозиторий, реализация в памяти, seed
server/auth/          сессия и проверка учётных данных
features/<область>/   компоненты, Server Actions и запросы конкретной области
components/ui/        компоненты shadcn/ui
components/layout/    шапка, логотип, служебные экраны
lib/                  форматирование, хук форм, общие типы
```

Зависимости идут в одну сторону: `domain` ← `server` ← `features` ← `app`.

## Скрипты

| Команда                                   | Что делает                                      |
| ----------------------------------------- | ----------------------------------------------- |
| `pnpm dev`                                | сервер разработки                               |
| `pnpm build` / `pnpm start`               | продакшен-сборка и запуск                       |
| `pnpm test`                               | все тесты                                       |
| `pnpm lint` / `pnpm lint:fix`             | ESLint                                          |
| `pnpm format` / `pnpm format:check`       | Prettier                                        |
| `pnpm typecheck`                          | генерация типов маршрутов и проверка TypeScript |
| `pnpm storybook` / `pnpm build-storybook` | Storybook                                       |

Перед каждым коммитом husky и lint-staged прогоняют изменённые файлы через ESLint и Prettier.
