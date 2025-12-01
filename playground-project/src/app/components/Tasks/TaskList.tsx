import React, { useState } from 'react';
import TaskItem from './TaskItem';
import type { TTask } from '@/app/tasks/page';

interface TaskListProps {
  tasks: TTask[];
  completeTask: (id: number) => void;
  editTask: (id: number, newText: string) => void;
  reorderTasks: (sourceId: number, targetId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  completeTask,
  editTask,
  reorderTasks,
}) => {
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggingId(id);
  };

  const handleDrop = (targetId: number) => {
    if (draggingId == null || draggingId === targetId) return;
    reorderTasks(draggingId, targetId);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-center">To do list</h2>

      {/* Cabeçalho só no desktop */}
      <div className="hidden sm:flex text-gray-300 text-sm mb-2 px-2">
        <span className="w-10 text-left">ID</span>
        <span className="w-16 text-center">Priority</span>
        <span className="flex-1 text-center">Description</span>
        <span className="w-32 text-right">Actions</span>
      </div>

      <ul id="taskList" className="space-y-2 relative">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            priority={index + 1}          // prioridade = posição atual
            completeTask={completeTask}
            editTask={editTask}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            isDragging={draggingId === task.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
