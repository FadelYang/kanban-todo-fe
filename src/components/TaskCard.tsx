import { useDraggable } from "@dnd-kit/core";
import { Task } from "../types";
import { Pencil, Trash2 } from "lucide-react";
import { FormEvent } from "react";
import { getUrl } from "../utils/getBackEndUrl";

const url = getUrl();

type TaskCardProps = {
  task: Task;
  fetchTask: () => {};
};

export const TaskCard = ({ task, fetchTask }: TaskCardProps) => {
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

      fetchTask();
    } catch (error: any) {
      alert(error?.message);
      return;
    }
  };

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      className="rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <div ref={setNodeRef} {...listeners} {...attributes} className='cursor-grab '>
        <h3 className="font-medium text-neutral-100">{task.title}</h3>
        <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
        <p className="mt-2 text-sm text-neutral-400">
          {new Date(task.created_at).toISOString()}
        </p>
      </div>
      <div className="flex gap-3 mt-5">
        <button className="hover:cursor-pointer">
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
  );
};
