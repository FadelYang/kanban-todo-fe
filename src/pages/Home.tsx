import { FormEvent, useEffect, useState } from "react";
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
  const [errorResponse, setErrorResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // new board data
  const [boardName, setBoardName] = useState("");

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

  const handleCreateBoard = async (e: FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true);
      const response = await fetch(`${url}/boards`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: boardName }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert("Failed add a new board");
        setErrorResponse(json.message);
        setIsLoading(false);
        return;
      }
      
      setIsCreateBoardModalOpen(false);
      await fetchBoards();
      setBoardName("");
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false);
      console.error(error);
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

      {/* create board modal */}
      {isCreateBoardModalOpen && (
        <BaseModal
          isOpen={isCreateBoardModalOpen}
          setIsOpen={setIsCreateBoardModalOpen}
        >
          <>
            <form className="flex flex-col gap-2" onSubmit={(e) => handleCreateBoard(e)}>
              <div className="flex flex-col gap-1">
                <label htmlFor="boardName">Board Name</label>
                <input
                  type="text"
                  id="boardName"
                  className="border rounded p-2 "
                  onChange={(e) => setBoardName(e.target.value)}
                  value={boardName}
                  required
                />
              </div>
              {errorResponse && <p className="text-red-500">{errorResponse}</p>}
              <div>
                <button
                  className="bg-black hover:cursor-pointer hover:bg-gray-800 text-white rounded py-2 px-4 mt-1"
                  type="submit"
                >
                  {isLoading ? "Add New Board..." : "Add New Board"}
                </button>
              </div>
            </form>
          </>
        </BaseModal>
      )}
    </div>
  );
};

export default Home;
