import { useState } from "react";
import { logoutUser } from "../features/auth/auth.service";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { sendTaskSummary } from "../services/email.service";

export function DashboardPage() {
    const { user } = useAuth();

    const {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        removeTask,
    } = useTasks();

    const [emailStatus, setEmailStatus] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const [filter, setFilter] = useState<
        "all" | "pending" | "completed"
    >("all");

    const [sortByPriority, setSortByPriority] =
        useState(false);

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = tasks.length - completedTasks;

    const filteredTasks = tasks
        .filter((task) => {
            if (filter === "pending") return !task.completed;
            if (filter === "completed") return task.completed;

            return true;
        })
        .sort((a, b) => {
            if (!sortByPriority) return 0;

            const priorities = {
                high: 3,
                medium: 2,
                low: 1,
            };

            return (
                priorities[b.priority ?? "medium"] -
                priorities[a.priority ?? "medium"]
            );
        });

    const handleLogout = async () => {
        await logoutUser();
    };

    const handleSendSummary = async () => {
        if (!user?.email) {
            setEmailStatus("No se encontró el email del usuario.");
            return;
        }

        setEmailStatus("");
        setIsSendingEmail(true);

        try {
            await sendTaskSummary({
                email: user.email,
                tasks,
            });

            setEmailStatus("Resumen enviado correctamente.");
        } catch {
            setEmailStatus("No se pudo enviar el resumen.");
        } finally {
            setIsSendingEmail(false);
        }
    };

    return (
        <main className="app-layout">
            <header className="dashboard-header">
                <div>
                    <h1>Task Manager</h1>

                    <p className="subtitle">
                        Organizá tus tareas y mantené el control de tus pendientes.
                    </p>

                    <p className="user-email">
                        Hola, {user?.displayName ?? user?.email}
                    </p>
                </div>

                <button
                    className="btn-secondary"
                    type="button"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </header>

            <section className="stats">
                <div className="stat-card">
                    <span>Pendientes</span>
                    <strong>{pendingTasks}</strong>
                </div>

                <div className="stat-card">
                    <span>Completadas</span>
                    <strong>{completedTasks}</strong>
                </div>
            </section>

            <section className="email-card">
                <div>
                    <h2>Resumen por email</h2>

                    <p>
                        Recibí un resumen actualizado del estado de tus tareas.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    type="button"
                    onClick={handleSendSummary}
                    disabled={isSendingEmail || tasks.length === 0}
                >
                    {isSendingEmail
                        ? "Enviando..."
                        : "Enviarme resumen"}
                </button>

                {emailStatus && (
                    <p className="status-message">
                        {emailStatus}
                    </p>
                )}
            </section>

            <TaskForm onAddTask={addTask} />

            <section>
                <h2>Filtrar tareas</h2>

                <div className="filter-bar">
                    <button
                        className={
                            filter === "all"
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() => setFilter("all")}
                    >
                        Todas
                    </button>

                    <button
                        className={
                            filter === "pending"
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() => setFilter("pending")}
                    >
                        Pendientes
                    </button>

                    <button
                        className={
                            filter === "completed"
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() => setFilter("completed")}
                    >
                        Completadas
                    </button>

                    <button
                        className={
                            sortByPriority
                                ? "filter-btn active"
                                : "filter-btn"
                        }
                        onClick={() =>
                            setSortByPriority(!sortByPriority)
                        }
                    >
                        {sortByPriority
                            ? "Prioridad activa"
                            : "Ordenar por prioridad"}
                    </button>
                </div>
            </section>

            {loading && (
                <p className="status-message">
                    Cargando tareas...
                </p>
            )}

            {error && (
                <p className="status-message error-message">
                    {error}
                </p>
            )}

            {!loading && (
                <TaskList
                    tasks={filteredTasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={removeTask}
                />
            )}
        </main>
    );
}

