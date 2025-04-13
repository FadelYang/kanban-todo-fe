import { useEffect, useState } from "react";
import { getUrl } from "../utils/getBackEndUrl";
import { Board as BoardType, Task } from "../types";
import { Board } from "../components/Board";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { BaseModal } from "../components/BaseModal";

const url = getUrl();

const Home = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  const fetchBoards = async () => {
    const response = await fetch(`${url}/boards`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setBoards(data.data);
  };

  const fetchTasks = async () => {
    const response = await fetch(`${url}/tasks`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setTasks(data.data);
  };

  const updateTaskStatus = async (taskId: number, newStatus: number) => {
    const response = await fetch(`${url}/tasks/${taskId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board_id: newStatus }),
    });

    if (!response.ok) {
      alert("Failed to update task status");
      return;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const newStatus = over.id as Task["board_id"];
    await updateTaskStatus(+taskId, newStatus);
    setTasks(() =>
      tasks.map((task) =>
        task.id === +taskId
          ? {
              ...task,
              board_id: newStatus,
            }
          : task
      )
    );
  };

  useEffect(() => {
    fetchBoards();
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col xl:flex-row justify-between mb-5 gap-3 xl:gap-0">
        <h1 className="text-3xl font-semibold">Your Daily Kanban!</h1>
        <div>
          <button
            className="flex gap-2 py-2 px-4 bg-neutral-800 rounded text-white hover:cursor-pointer hover:bg-neutral-950"
            type="button"
            onClick={() => setIsCreateBoardModalOpen(true)}
          >
            Add New Board <Plus />
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <DndContext onDragEnd={handleDragEnd}>
          {boards.map((board) => {
            return (
              <Board
                key={board.id}
                board={board}
                tasks={tasks.filter((task) => task.board_id === board.id)}
                fetchBoard={fetchBoards}
                fetchTask={fetchTasks}
              />
            );
          })}
        </DndContext>
      </div>
      {isCreateBoardModalOpen && (
        <BaseModal
          isOpen={isCreateBoardModalOpen}
          setIsOpen={setIsCreateBoardModalOpen}
        >
          <p>Halo</p>
        </BaseModal>
      )}
    </div>
  );
};

export default Home;
