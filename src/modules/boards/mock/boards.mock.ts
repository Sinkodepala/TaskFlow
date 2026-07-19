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
      columns: [],
    },
  ],
};