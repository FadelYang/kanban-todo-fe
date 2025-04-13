import { useDraggable } from "@dnd-kit/core";
import { Task } from "../types";
import { Pencil, Trash2 } from 'lucide-react';

type TaskCardProps = {
  task: Task;
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
      <p className="mt-2 text-sm text-neutral-400">
        {new Date(task.created_at).toISOString()}
      </p>
      <div className='flex gap-3 mt-5'>
        <button className='hover:cursor-pointer'>
          <Pencil size={18} color='#c27aff'/>
        </button>
        <button className='hover:cursor-pointer'>
          <Trash2 size={18} color='#ff6467'/>
        </button>
      </div>
    </div>
  );
};
