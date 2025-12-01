import React from 'react';
import type { TTask } from '@/app/tasks/page';

interface CompletedTaskListProps {
  completedTasks: TTask[];
}

const CompletedTaskList: React.FC<CompletedTaskListProps> = ({
  completedTasks,
}) => {
  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold mb-4 text-center">Completed Tasks</h2>

      {/* Cabeçalho da “tabela” */}
      <div className="flex text-gray-300 text-sm mb-2 px-2">
        <span className="w-10 text-left">ID</span>
        <span className="flex-1 text-center">Description</span>
        <span className="w-28 text-right">Status</span>
      </div>

      <ul id="completedTaskList" className="space-y-2">
        {completedTasks.map((task) => (
          <li
            key={task.id}
            id={`completedTask-${task.id}`}
            data-testid={`completed-task-${task.id}`}
            className="bg-gray-600 p-3 rounded-md shadow-md flex items-center gap-2"
          >
            {/* ID à esquerda */}
            <span className="w-10 text-left font-mono text-sm text-gray-300">
              #{task.id}
            </span>

            {/* Descrição riscada no centro */}
            <span
              className="flex-1 text-center line-through opacity-70 break-all overflow-hidden"
              data-testid={`completed-task-text-${task.id}`}
            >
              {task.text}
            </span>

            {/* Status à direita */}
            <span
              className="w-28 text-center text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 text-green-300 uppercase tracking-wide"
              data-testid={`completed-task-status-${task.id}`}
            >
              Complete
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTaskList;
