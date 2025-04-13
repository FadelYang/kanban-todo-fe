import { useDroppable } from "@dnd-kit/core";
import { Board as BoardType, Task } from "../types";
import { TaskCard } from "./TaskCard";
import { Pencil, Trash2 } from "lucide-react";
import { getUrl } from "../utils/getBackEndUrl";
import { FormEvent } from "react";

const url = getUrl();

type BoardProps = {
  board: BoardType;
  tasks: Task[];
  fetchBoard: () => {}
  fetchTask: () => {}
};

export const Board = ({ board, tasks, fetchBoard, fetchTask }: BoardProps) => {
  const { setNodeRef } = useDroppable({
    id: board.id,
  });

  const deleteBoard = async (boardId: number, e: FormEvent) => {
    e.preventDefault();
    const isConfirm = confirm("Are you sure you want delete this board?");
    if (!isConfirm) return;
    try {
      const response: any = await fetch(`${url}/boards/${boardId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json()

      if (!response.ok) {
        alert(data?.message);
        return;
      }

      fetchBoard();
    } catch (error: any) {
      alert(error?.message);
      return;
    }
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-neutral-100">{board.name}</h2>
        <div className="flex justify-end gap-3 text-purp">
          <button className="hover:cursor-pointer">
            <Pencil size={18} color="#c27aff" />
          </button>
          <button
            className="hover:cursor-pointer"
            type="button"
            onClick={(e) => deleteBoard(board.id, e)}
          >
            <Trash2 size={18} color="#ff6467" />
          </button>
        </div>
      </div>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} fetchTask={fetchTask}/>;
        })}
      </div>
    </div>
  );
};
