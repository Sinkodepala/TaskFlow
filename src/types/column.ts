import type { TaskCard } from "@/types/card";

export interface BoardColumn {
  id: string;
  title: string;
  cards: TaskCard[];
}