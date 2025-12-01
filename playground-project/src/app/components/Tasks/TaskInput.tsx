import React from 'react';

interface TaskInputProps {
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  addTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ task, setTask, addTask }) => {
  return (
    <form
      onSubmit={addTask}
      className="mb-8 flex flex-col gap-2 items-center w-full max-w-md mx-auto"
      data-testid="task-form"
    >
      <input
        id="taskInput"
        data-testid="task-input"
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Describe your task"
        className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />

      <button
        id="submitButton"
        data-testid="task-submit-button"
        type="submit"
        className="w-4/12 bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 mt-4 text-center"
      >
        Add
      </button>
    </form>
  );
};

export default TaskInput;
