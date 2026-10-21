import type { Task } from "../types/Task";

interface SendTaskSummaryData {
    email: string;
    tasks: Task[]
}

export const sendTaskSummary = async (
    data: SendTaskSummaryData
) => {
    const response = await fetch("/api/send-task-summary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: data.email,
            tasks: data.tasks,
        }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.message || "No se pudo enviar el resumen.");
    }

    return result;
};