import { useDroppable } from "@dnd-kit/core";
import { Board as BoardType, Task } from "../types";
import { TaskCard } from "./TaskCard";
import { Pencil, Trash2 } from "lucide-react";

type BoardProps = {
  board: BoardType;
  tasks: Task[];
};

export const Board = ({ board, tasks }: BoardProps) => {
  const { setNodeRef } = useDroppable({
    id: board.id,
  });

  return (
    <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-neutral-100">{board.name}</h2>
        <div className="flex justify-end gap-3 text-purp">
          <button className="hover:cursor-pointer">
            <Pencil size={18} color="#c27aff" />
          </button>
          <button className="hover:cursor-pointer">
            <Trash2 size={18} color="#ff6467" />
          </button>
        </div>
      </div>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
};
