import type { TaskPriority } from "@/types/card";


export interface CreateCardFormValues {
    title: string;
    description: string;
    priority: TaskPriority;
}