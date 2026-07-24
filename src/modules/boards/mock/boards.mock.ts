import type { Workspace } from "@/types/workspace";

export const mockWorkspace: Workspace = {
  id: "workspace-1",
  title: "TaskFlow Workspace",
  description: "Рабочее пространство для управления задачами",
  boards: [
    {
      id: "board-1",
      title: "TaskFlow Development",
      description: "Разработка приложения TaskFlow",
      columns: [
        {
          id: "column-1",
          title: "To Do",
          cards: [
            {
              id: "card-1",
              title: "Настроить Vite",
              description: "Базовая конфигурация проекта",
              status: "todo",
              priority: "medium",
              dueDate: "",
              createdAt: "2026-07-01T10:00:00.000Z",
              updatedAt: "2026-07-01T10:00:00.000Z",
            },
            {
              id: "card-2",
              title: "Сверстать сайдбар",
              description: "Навигация и логотип",
              status: "todo",
              priority: "low",
              dueDate: "",
              createdAt: "2026-07-01T11:00:00.000Z",
              updatedAt: "2026-07-01T11:00:00.000Z",
            },
            {
              id: "card-3",
              title: "Подключить Redux",
              description: "Store и слайсы",
              status: "todo",
              priority: "high",
              dueDate: "",
              createdAt: "2026-07-01T12:00:00.000Z",
              updatedAt: "2026-07-01T12:00:00.000Z",
            },
          ],
        },
        {
          id: "column-2",
          title: "In Progress",
          cards: [
            {
              id: "card-4",
              title: "Фильтры по приоритету",
              description: "Отбор карточек на доске",
              status: "inProgress",
              priority: "high",
              dueDate: "",
              createdAt: "2026-07-02T09:00:00.000Z",
              updatedAt: "2026-07-02T09:00:00.000Z",
            },
            {
              id: "card-5",
              title: "Модалки карточек",
              description: "Создание и редактирование",
              status: "inProgress",
              priority: "medium",
              dueDate: "",
              createdAt: "2026-07-02T10:00:00.000Z",
              updatedAt: "2026-07-02T10:00:00.000Z",
            },
          ],
        },
        {
          id: "column-3",
          title: "Done",
          cards: [
            {
              id: "card-6",
              title: "Инициализация репозитория",
              description: "Первый коммит",
              status: "done",
              priority: "low",
              dueDate: "",
              createdAt: "2026-06-28T08:00:00.000Z",
              updatedAt: "2026-06-28T08:00:00.000Z",
            },
          ],
        },
      ],
    },
  ],
};
