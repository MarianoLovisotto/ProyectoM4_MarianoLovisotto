import type { Task } from "../types/Task";

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (task: Task) => Promise<void>;
    onDeleteTask: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
    if (tasks.length === 0) {
        return <p>No tienes tareas creadas.</p>;
    }

    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Estado: {task.completed ? "Completada" : "Pendiente"} </p>

                    <button type="button" onClick={() => onToggleTask(task)}>
                        {task.completed ? "Marcar pendiente" : "Marcar completada"}
                    </button>

                    <button type="button" onClick={() => onDeleteTask(task.id)}>
                        Eliminar
                    </button>

                </li>
            ))}

        </ul>
    )
}

