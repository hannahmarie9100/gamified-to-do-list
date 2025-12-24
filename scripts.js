const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", function () {
  const text = taskInput.value.trim();
  if (text == "") return; // if empty string

  const li = document.createElement("li"); // create new list item

  const checkbox = document.createElement("input"); // create checkbox
  checkbox.type = "checkbox"; // set checkbox type to checkbox

  const span = document.createElement("span"); // create span element
  span.textContent = text; // set span text content to task text

  checkbox.addEventListener("change", function () {
    li.classList.toggle("completed", this.checked); // toggle completed class on span element
  });

  li.appendChild(checkbox); // append checkbox to list item
  li.appendChild(span); // append span to list item
  taskList.appendChild(li); // append list item to task list

  taskInput.value = ""; // clear input field after adding task
});
