import type { Board } from "@/types/board";

export interface Workspace {
  id: string;
  title: string;
  description: string;
  boards: Board[];
}