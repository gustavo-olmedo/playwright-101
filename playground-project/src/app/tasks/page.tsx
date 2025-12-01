'use client';

import React, { useState } from 'react';
import { InstructionsTasks } from '../components/Instructions/Instructions';
import TaskInput from '../components/Tasks/TaskInput';
import TaskList from '../components/Tasks/TaskList';
import CompletedTaskList from '../components/Tasks/CompletedTaskList';

export interface TTask {
  id: number;
  text: string;
}

export default function Task() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TTask[]>([]);
  const [nextId, setNextId] = useState(1);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = task.trim();
    if (!trimmed) return;

    const newTask: TTask = {
      id: nextId,
      text: trimmed,
    };

    setTasks((prev) => [...prev, newTask]);
    setNextId((prev) => prev + 1);
    setTask('');
  };

  const completeTask = (id: number) => {
    const taskToComplete = tasks.find((t) => t.id === id);
    if (!taskToComplete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletedTasks((prev) => [...prev, taskToComplete]);
  };

  const editTask = (id: number, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
  };

  const reorderTasks = (sourceId: number, targetId: number) => {
    setTasks((prev) => {
      const sourceIndex = prev.findIndex((t) => t.id === sourceId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  return (
    <div
      id="task"
      className="min-h-screen bg-gray-800 pt-2 px-4 sm:px-6 lg:px-8"
      data-testid="task-page"
    >
      <InstructionsTasks />

      <div className="max-w-5xl mx-auto">
        <h1
          id="taskTitle"
          className="text-2xl font-bold mb-6 text-center"
          data-testid="task-title"
        >
          To do list
        </h1>

        {/* centraliza o formulário / input */}
        <div className="flex justify-center">
          <TaskInput task={task} setTask={setTask} addTask={addTask} />
        </div>

        {tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            completeTask={completeTask}
            editTask={editTask}
            reorderTasks={reorderTasks}
          />
        )}

        {completedTasks.length > 0 && (
          <CompletedTaskList completedTasks={completedTasks} />
        )}
      </div>
    </div>
  );
}
