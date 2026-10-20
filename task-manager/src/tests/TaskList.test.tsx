import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskList } from "../components/TaskList";
import type { Task } from "../types/Task";

const tasks: Task[] = [
    {
        id: "1",
        userId: "user-1",
        title: "Estudiar TypeScript",
        description: "Repasar tipos e interfaces",
        completed: false,
        createdAt: 1,
    },
    {
        id: "2",
        userId: "user-1",
        title: "Enviar proyecto",
        description: "Subir entrega final",
        completed: true,
        createdAt: 2,
    },
];

describe("TaskList", () => {
    it("muestra mensaje cuando no hay tareas", () => {
        render(
            <TaskList
                tasks={[]}
                onToggleTask={vi.fn()}
                onDeleteTask={vi.fn()}
            />
        );

        expect(screen.getByText("No tenés tareas creadas.")).toBeInTheDocument();
    });

    it("renderiza tareas con sus estados", () => {
        render(
            <TaskList
                tasks={tasks}
                onToggleTask={vi.fn()}
                onDeleteTask={vi.fn()}
            />
        );

        expect(screen.getByText("Estudiar TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();

        expect(screen.getByText("Enviar proyecto")).toBeInTheDocument();
        expect(screen.getByText("Completada")).toBeInTheDocument();
    });

    it("ejecuta acciones de completar y eliminar", async () => {
        const user = userEvent.setup();
        const onToggleTask = vi.fn().mockResolvedValue(undefined);
        const onDeleteTask = vi.fn().mockResolvedValue(undefined);

        render(
            <TaskList
                tasks={tasks}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
            />
        );

        await user.click(screen.getByRole("button", { name: "Marcar completada" }));
        await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);

        expect(onToggleTask).toHaveBeenCalledWith(tasks[0]);
        expect(onDeleteTask).toHaveBeenCalledWith("1");
    });
});