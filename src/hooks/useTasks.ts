import { useEffect, useState } from "react";
import { subscribeToUserTasks, createTask, updateTask, deleteTask } from "../features/tasks/task.service";
import { useAuth } from "./useAuth";
import type { Task } from "../types/Task";

export const useTasks = () => {
    const { user, loading: authLoading } = useAuth()

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        const unsubscribe = subscribeToUserTasks(
            user.uid,
            (tasksFromFirestore) => {
                setTasks(tasksFromFirestore);
                setLoading(false);
            },
            () => {
                setError("No se pudieron cargar las tareas.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, authLoading]);

    const addTask = async (
        title: string,
        description: string,
        dueDate: string
    ) => {
        if (!user) return;

        await createTask({
            title,
            description,
            dueDate,
            userId: user.uid,
        });
    };

    const toggleTask = async (task: Task) => {
        await updateTask(task.id, {
            completed: !task.completed,
        });
    };

    const removeTask = async (taskId: string) => {
        await deleteTask(taskId);
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        removeTask,
    };
};