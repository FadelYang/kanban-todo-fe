import { Board as BoardType, Task } from "../types";
import { TaskCard } from './TaskCard';

type BoardProps = {
  board: BoardType;
  tasks: Task[];
};

export const Board = ({ board, tasks }: BoardProps) => {
  return (
    <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <h2 className="mb-4 font-semibold text-neutral-100">{board.name}</h2>
      <div  className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
};
