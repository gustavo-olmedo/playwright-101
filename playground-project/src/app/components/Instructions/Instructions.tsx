import React from 'react';

export function InstructionsLogin() {
  return (
    <div
      id="instructionsLogin"
      className="bg-gray-800 p-6 max-w-2xl mx-auto text-gray-100 rounded-3xl"
    >
      <p
        id="instructionsLoginHeader"
        className="text-center mb-6 font-bold text-l"
      >
        Login Instructions
      </p>
      <ul id="instructionsLoginList" className="list-disc list-inside mb-6">
        <li id="instructionsLoginItem1">
          When using a valid username and password, it should return{' '}
          <strong>logged in user</strong>.
        </li>
        <li id="instructionsLoginItem2">
          Incorrect username or password should return an error message.
        </li>
        <li id="instructionsLoginItem3">
          Three incorrect passwords will temporarily lock the account.
        </li>
      </ul>
    </div>
  );
}

export function InstructionsForm() {
  return (
    <div
      id="instructionsForm"
      className="bg-gray-800 p-6 max-w-2xl mx-auto text-gray-100 rounded-3xl mb-6"
    >
      <p
        id="instructionsFormHeader"
        className="text-center mb-6 font-bold text-l"
      >
        Registration Instructions
      </p>
      <ul id="instructionsFormList" className="list-disc list-inside mb-6">
        <li id="instructionsFormItem1">
          Fill in all required fields: name, email, password, country, and
          gender.
        </li>
        <li id="instructionsFormItem2">
          Choose your leisure preferences by selecting the corresponding
          checkboxes.
        </li>
        <li id="instructionsFormItem3">
          After submitting the form, you will receive a confirmation message
          indicating whether the registration was successful.
        </li>
      </ul>
    </div>
  );
}

export function InstructionsTable() {
  return (
    <div
      id="instructionsTable"
      className="bg-gray-800 p-6 max-w-2xl mx-auto text-gray-100 rounded-3xl mb-6"
    >
      <p
        id="instructionsTableHeader"
        className="text-center mb-6 font-bold text-l"
      >
        Dynamic Table Instructions
      </p>
      <ul id="instructionsTableList" className="list-disc list-inside mb-6">
        <li id="instructionsTableItem1">
          Check out the Harry Potter character table below.
        </li>
        <li id="instructionsTableItem2">
          The order of the characters changes every time the page is loaded.
        </li>
        <li id="instructionsTableItem3">
          Each entry displays the image, name, house, date of birth, and actor.
        </li>
      </ul>
    </div>
  );
}

export function InstructionsTasks() {
  return (
    <div
      id="instructionsToDo"
      className="bg-gray-800 p-6 max-w-2xl mx-auto text-gray-100 rounded-3xl mb-6"
    >
      <p
        id="instructionsToDoHeader"
        className="text-center mb-6 font-bold text-l"
      >
        Task Instructions
      </p>
      <ul id="instructionsToDoList" className="list-disc list-inside mb-6">
        <li id="instructionsToDoItem1">
          Add a task in the input field and click &quot;Add Task&quot;.
        </li>
        <li id="instructionsToDoItem2">
          The task will appear below in the &quot;Tasks to do&quot; section.
        </li>
        <li id="instructionsToDoItem3">
          Click the &quot;Complete&quot; button next to a task to move it to the
          completed tasks section.
        </li>
      </ul>
    </div>
  );
}
