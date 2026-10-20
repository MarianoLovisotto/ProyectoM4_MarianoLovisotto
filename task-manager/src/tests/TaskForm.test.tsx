import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskForm } from "../components/TaskForm";

describe("TaskForm", () => {
    it("envía la tarea sin espacios al inicio o al final", async () => {
        const user = userEvent.setup();
        const onAddTask = vi.fn().mockResolvedValue(undefined);

        render(<TaskForm onAddTask={onAddTask} />);

        await user.type(screen.getByPlaceholderText("Título"), "  Tarea test  ");
        await user.type(
            screen.getByPlaceholderText("Descripción"),
            "  Descripción test  "
        );

        await user.click(screen.getByRole("button", { name: "Crear tarea" }));

        expect(onAddTask).toHaveBeenCalledWith(
            "Tarea test",
            "Descripción test",
            "medium",
            ""
        );
    });

    it("envía la tarea con título, descripción, prioridad y fecha", async () => {
        const user = userEvent.setup();
        const onAddTask = vi.fn().mockResolvedValue(undefined);

        render(<TaskForm onAddTask={onAddTask} />);

        await user.type(screen.getByPlaceholderText("Título"), "Tarea test");
        await user.type(
            screen.getByPlaceholderText("Descripción"),
            "Descripción test"
        );

        await user.selectOptions(screen.getByRole("combobox"), "high");
        await user.type(screen.getByDisplayValue(""), "2026-06-30");

        await user.click(screen.getByRole("button", { name: "Crear tarea" }));

        expect(onAddTask).toHaveBeenCalledWith(
            "Tarea test",
            "Descripción test",
            "high",
            "2026-06-30"
        );
    });
});