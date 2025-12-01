
export const TEST_IDS = {
  page: {
    taskPage: 'task-page',
    taskTitle: 'task-title',
  },
  input: {
    form: 'task-form',
    input: 'task-input',
    submitButton: 'task-submit-button',
  },
  list: {
    todoListWrapper: 'todo-list-wrapper',
    todoListTitle: 'todo-list-title',
    todoList: 'todo-list',
    todoItem: (index: number) => `todo-item-${index}`,
    todoItemCompleteButton: (index: number) =>
      `todo-item-complete-button-${index}`,
  },
  completed: {
    completedListWrapper: 'completed-task-list-wrapper',
    completedListTitle: 'completed-task-list-title',
    completedList: 'completed-task-list',
    completedItem: (index: number) => `completed-task-item-${index}`,
  },
};
