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
              title: "Создать кнопку авторизации",
              description: "Добавить UI кнопку входа",
              status: "todo",
              priority: "medium",
              dueDate: "2026-07-13",
              createdAt: "2026-07-12",
              updatedAt: "2026-07-12",
            },
          ],
        },
        {
          id: "column-2",
          title: "In Progress",
          cards: [
            {
              id: "card-2",
              title: "Настроить Redux Toolkit",
              description: "Создать базовый store",
              status: "inProgress",
              priority: "high",
              dueDate: "2026-07-15",
              createdAt: "2026-07-12",
              updatedAt: "2026-07-12",
            },
          ],
        },
        {
          id: "column-3",
          title: "Done",
          cards: [
            {
              id: "card-3",
              title: "Настроить React Router",
              description: "Создать маршруты приложения",
              status: "done",
              priority: "low",
              dueDate: "2026-07-10",
              createdAt: "2026-07-12",
              updatedAt: "2026-07-12",
            },
          ],
        },
      ],
    },
  ],
};