import type { Task } from "../types/Task";

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (task: Task) => Promise<void>;
    onDeleteTask: (taskId: string) => Promise<void>;
}

interface TaskBadgesProps {
    task: Task;
}

const getPriorityLabel = (priority?: Task["priority"]) => {
    if (priority === "high") return "Alta";
    if (priority === "low") return "Baja";

    return "Media";
};

function TaskBadges({ task }: TaskBadgesProps) {
    const priorityClass = task.priority ?? "medium";
    const statusClass = task.completed ? "completed" : "pending";
    const statusLabel = task.completed ? "Completada" : "Pendiente";

    return (
        <div className="badge-group">
            <span className={`priority-badge ${priorityClass}`}>
                {getPriorityLabel(task.priority)}
            </span>

            <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
        </div>
    );
}

export function TaskList({
    tasks,
    onToggleTask,
    onDeleteTask,
}: TaskListProps) {
    if (tasks.length === 0) {
        return <p>No tenés tareas creadas.</p>;
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li className="task-card" key={task.id}>
                    <div className="task-header">
                        <h3>{task.title}</h3>
                        <TaskBadges task={task} />
                    </div>

                    {task.dueDate && (
                        <p className="due-date">Fecha límite: {task.dueDate}</p>
                    )}

                    <p>{task.description}</p>

                    <button type="button" onClick={() => onToggleTask(task)}>
                        {task.completed ? "Marcar pendiente" : "Marcar completada"}
                    </button>

                    <button type="button" onClick={() => onDeleteTask(task.id)}>
                        Eliminar
                    </button>
                </li>
            ))}
        </ul>
    );
}