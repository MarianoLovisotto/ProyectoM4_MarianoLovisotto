import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import type { Unsubscribe, UpdateData } from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Task } from "../../types/Task";

const TASKS_COLLECTION = "tasks";

interface CreateTaskData {
    title: string;
    description: string;
    dueDate: string;
    userId: string;
}

type UpdateTaskData = UpdateData<Omit<Task, "id">>;

export const subscribeToUserTasks = (

    userId: string,
    onTaskChange: (tasks: Task[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const tasksQuery = query(tasksRef, where("userId", "==", userId));

    return onSnapshot(
        tasksQuery,
        (snapshot) => {
            const tasks = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            })) as Task[];

            tasks.sort((a, b) => b.createdAt - a.createdAt);

            onTaskChange(tasks);
        },
        (error) => {
            onError(error);
        }
    );
};

export const createTask = async (data: CreateTaskData) => {
    await addDoc(collection(db, TASKS_COLLECTION), {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        userId: data.userId,
        completed: false,
        createdAt: Date.now(),
    });
};

export const updateTask = async (taskId: string, data: UpdateTaskData) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, data);
};

export const deleteTask = async (taskId: string) => {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef)
}