export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;

    priority?: "low" | "medium" | "high";
    dueDate?: string
}