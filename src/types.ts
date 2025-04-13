export type Task = {
  id: number,
  title: string,
  description?: string,
  board_id: number,
  user_id: number,
  created_at: Date
}

export type Board = {
  id: number,
  name: string,
  user_id: string,
  tasks: Task
}