import type { BoardColumn } from '@/types/column';

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: BoardColumn[];
}