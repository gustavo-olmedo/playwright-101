import React, { useState } from 'react';
import type { TTask } from '@/app/tasks/page';

interface TaskItemProps {
  task: TTask;
  priority: number;
  completeTask: (id: number) => void;
  editTask: (id: number, newText: string) => void;
  onDragStart: (id: number) => void;
  onDrop: (id: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  priority,
  completeTask,
  editTask,
  onDragStart,
  onDrop,
  onDragEnd,
  isDragging,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    editTask(task.id, trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(task.text);
    setIsEditing(false);
  };

  return (
    <li
      id={`task-${task.id}`}
      data-testid={`todo-item-${task.id}`}
      className={`
        bg-gray-700 p-3 rounded-md shadow-md
        ${isDragging ? 'opacity-60 ring-2 ring-gray-300' : ''}
      `}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(task.id)}
      onDragEnd={onDragEnd}
    >
      {/* ======= MOBILE (CARD) ======= */}
      <div className="flex flex-col gap-2 sm:hidden">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center text-xs text-gray-200">
          <span className="font-mono">
            <span className="text-gray-400">ID:</span> #{task.id}
          </span>

          <span
            className="font-mono"
            data-testid={`todo-item-priority-mobile-${task.id}`}
          >
            <span className="text-gray-400">Priority:</span> {priority}
          </span>
        </div>

        {/* Caixa da descrição */}
        <div
          className={`border border-gray-500 rounded-md p-3 ${
            isEditing ? 'bg-gray-800' : 'bg-gray-700'
          }`}
        >
          {isEditing ? (
            <textarea
              data-testid={`todo-item-edit-input-mobile-${task.id}`}
              id={`todo-item-edit-input-${task.id}`}
              className="
                w-full
                bg-transparent
                border-none
                outline-none
                text-left text-white text-sm leading-relaxed
                resize-none
                p-0
              "
              rows={3}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) : (
            <p
              className="
                text-left text-gray-100 text-sm leading-relaxed whitespace-normal break-words
                p-1
              "
              data-testid={`todo-item-text-mobile-${task.id}`}
            >
              {task.text}
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="flex justify-around w-full mt-1">
          {isEditing ? (
            <>
              <button
                data-testid={`todo-item-cancel-button-mobile-${task.id}`}
                onClick={handleCancel}
                className="bg-gray-500 text-white font-bold py-1 px-4 rounded-md hover:bg-gray-600 text-xs"
              >
                Cancel
              </button>

              <button
                data-testid={`todo-item-save-button-mobile-${task.id}`}
                onClick={handleSave}
                className="bg-gray-100 text-gray-800 font-bold py-1 px-4 rounded-md hover:bg-gray-300 text-xs"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                data-testid={`todo-item-edit-button-mobile-${task.id}`}
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 text-gray-800 font-bold py-1 px-4 rounded-md hover:bg-gray-300 text-xs"
              >
                Edit
              </button>

              <button
                data-testid={`todo-item-complete-button-mobile-${task.id}`}
                onClick={() => completeTask(task.id)}
                className="bg-gray-200 text-gray-800 font-bold py-1 px-4 rounded-md hover:bg-gray-400 text-xs"
              >
                Complete
              </button>
            </>
          )}
        </div>
      </div>

      {/* ======= DESKTOP (TABELA) ======= */}
      <div className="hidden sm:flex sm:items-center sm:gap-2">
        {/* ID */}
        <span className="font-mono text-sm text-gray-300 sm:w-10">
          #{task.id}
        </span>

        {/* Priority */}
        <span
          className="font-mono text-xs text-gray-200 sm:w-16 text-center"
          data-testid={`todo-item-priority-desktop-${task.id}`}
        >
          {priority}
        </span>

        {/* Descrição */}
        <div className="sm:flex-1">
          <div
            className={`border border-gray-500 rounded-md px-2 py-1 ${
              isEditing ? 'bg-gray-800' : 'bg-gray-700'
            }`}
          >
            {isEditing ? (
              <input
                data-testid={`todo-item-edit-input-desktop-${task.id}`}
                id={`todo-item-edit-input-desktop-${task.id}`}
                className="
                  w-full
                  bg-transparent
                  border-none
                  outline-none
                  text-center text-white text-sm
                  leading-relaxed
                "
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <span
                className="block text-center text-gray-100 break-words text-sm"
                data-testid={`todo-item-text-desktop-${task.id}`}
                onDoubleClick={() => setIsEditing(true)}
              >
                {task.text}
              </span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 justify-end sm:w-32">
          {isEditing ? (
            <>
              <button
                data-testid={`todo-item-cancel-button-desktop-${task.id}`}
                onClick={handleCancel}
                className="bg-gray-500 text-white font-bold py-1 px-2 rounded-md hover:bg-gray-600 text-xs"
              >
                Cancel
              </button>
              <button
                data-testid={`todo-item-save-button-desktop-${task.id}`}
                onClick={handleSave}
                className="bg-gray-100 text-gray-800 font-bold py-1 px-2 rounded-md hover:bg-gray-300 text-xs"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                data-testid={`todo-item-complete-button-desktop-${task.id}`}
                onClick={() => completeTask(task.id)}
                className="bg-gray-200 text-gray-800 font-bold py-1 px-2 rounded-md hover:bg-gray-400 text-xs"
              >
                Complete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;
