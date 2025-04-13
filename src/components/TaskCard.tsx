import { useDraggable } from "@dnd-kit/core";
import { Task } from "../types";
import { Pencil, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { getUrl } from "../utils/getBackEndUrl";
import { BaseModal } from "./BaseModal";

const url = getUrl();

type TaskCardProps = {
  task: Task;
  fetchTask: () => Promise<void>;
};

type UpdateTaskBody = {
  id: number;
  title: string;
  description: string | undefined;
};

export const TaskCard = ({ task, fetchTask }: TaskCardProps) => {
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState<any>({});

  // update task
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState<string | undefined>(
    ""
  );

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const deleteTask = async (taskId: number, e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isConfirm = confirm("Are you sure you want delete this task??");
    if (!isConfirm) return;
    try {
      const response: any = await fetch(`${url}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message);
        return;
      }

      await fetchTask();
    } catch (error: any) {
      alert(error?.message);
      return;
    }
  };

  const handleUpdateTask = async (data: UpdateTaskBody, e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response: any = await fetch(`${url}/tasks/${data.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskName, description: taskDescription }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert("Failed create a new task");
        setIsLoading(false);
        setErrorResponse(json);
        return;
      }

      await fetchTask();
      setIsLoading(false);
      setIsUpdateTaskModalOpen(false);
      setTaskName("");
      setTaskDescription("");
    } catch (error) {
      alert("Something went wrong" + error);
    }
  };

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <>
      <div
        className="rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
        style={style}
      >
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className="cursor-grab "
        >
          <h3 className="font-medium text-neutral-100">{task.title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
          <p className="mt-2 text-sm text-neutral-400">
            {new Date(task.created_at).toISOString()}
          </p>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            className="hover:cursor-pointer"
            type="button"
            onClick={() => {
              setTaskName(task.title);
              setTaskDescription(task.description);
              setIsUpdateTaskModalOpen(true);
            }}
          >
            <Pencil size={18} color="#c27aff" />
          </button>
          <button
            className="hover:cursor-pointer"
            type="button"
            onClick={(e) => deleteTask(task.id, e)}
          >
            <Trash2 size={18} color="#ff6467" />
          </button>
        </div>
      </div>

      {isUpdateTaskModalOpen && (
        <BaseModal
          isOpen={isUpdateTaskModalOpen}
          setIsOpen={setIsUpdateTaskModalOpen}
          title={`Update Task`}
        >
          <>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) =>
                handleUpdateTask(
                  {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                  },
                  e
                )
              }
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="taskName">Task Name</label>
                <input
                  type="text"
                  id="taskName"
                  className="border rounded p-2 "
                  onChange={(e) => setTaskName(e.target.value)}
                  value={taskName}
                  required
                />
                {errorResponse && (
                  <p className="text-red-500">{errorResponse[0]?.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="taskDescription">Task Description</label>
                <textarea
                  id="taskDescription"
                  className="border rounded p-2 "
                  onChange={(e) => setTaskDescription(e.target.value)}
                  value={taskDescription}
                />
                {errorResponse && (
                  <p className="text-red-500">{errorResponse[1]?.message}</p>
                )}
              </div>
              <div>
                <button
                  className="bg-black hover:cursor-pointer hover:bg-gray-800 text-white rounded py-2 px-4 mt-1"
                  type="submit"
                >
                  {isLoading ? "Update Task..." : "Update Task"}
                </button>
              </div>
            </form>
          </>
        </BaseModal>
      )}
    </>
  );
};
