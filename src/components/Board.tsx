import { useDroppable } from "@dnd-kit/core";
import { Board as BoardType, Task } from "../types";
import { TaskCard } from "./TaskCard";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getUrl } from "../utils/getBackEndUrl";
import { FormEvent, useState } from "react";
import { BaseModal } from "./BaseModal";

const url = getUrl();

type BoardProps = {
  board: BoardType;
  tasks: Task[];
  fetchBoard: () => {};
  fetchTask: () => {};
};

export const Board = ({ board, tasks, fetchBoard, fetchTask }: BoardProps) => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState<any>({});

  // create new task
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

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

      const data = await response.json();

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

  const handleAddNewTask = async (boardId: number, e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response: any = await fetch(`${url}/tasks/${boardId}`, {
        method: "POST",
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

      fetchTask();
      setIsLoading(false);
      setIsCreateTaskModalOpen(false);
      setTaskName("");
      setTaskDescription("");
      return;
    } catch (error) {
      setIsLoading(false);
      alert("Something error: " + error);
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-neutral-100">{board.name}</h2>
          <div className="flex justify-end gap-3 text-purp">
            <button
              className="hover:cursor-pointer"
              type="button"
              onClick={() => setIsCreateTaskModalOpen(true)}
            >
              <Plus size={20} color="#51a2ff" />
            </button>
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
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-4 min-h-10">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} fetchTask={fetchTask} />
            ))
          ) : (
            <div className="flex justify-center items-center h-full mt-2 text-sm text-neutral-500">
              Drop tasks here
            </div>
          )}
        </div>
      </div>

      {isCreateTaskModalOpen && (
        <BaseModal
          isOpen={isCreateTaskModalOpen}
          setIsOpen={setIsCreateTaskModalOpen}
          title={`Create new task with status "${board.name}"`}
        >
          <>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => handleAddNewTask(board.id, e)}
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
                  {isLoading ? "Add New Task..." : "Add New Task"}
                </button>
              </div>
            </form>
          </>
        </BaseModal>
      )}
    </>
  );
};
