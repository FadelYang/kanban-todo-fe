import { useEffect, useState } from "react";
import { getUrl } from "../utils/getBackEndUrl";
import { Board as BoardType, Task } from "../types";
import { Board } from '../components/Board';

const url = getUrl();

const Home = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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

  useEffect(() => {
    fetchBoards();
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-2 flex-wrap">
          {boards.map((board) => {
            return (
              <Board
                key={board.id}
                board={board}
                tasks={tasks.filter((task) => task.board_id === board.id)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Home;
