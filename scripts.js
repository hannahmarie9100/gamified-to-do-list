const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Timer variables
let elapsedSeconds = 0;
let timerInterval = null; //controls start and stop

//award point variables
let totalTasksCompleted = 0;
let rewards = [];

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function renderTimer() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(elapsedSeconds);
  }
}

//start timer
if (startBtn) {
  startBtn.addEventListener("click", function () {
    //if there is no timer running, start one
    if (!timerInterval) {
      timerInterval = setInterval(function () {
        elapsedSeconds++;
        renderTimer();
      }, 1000); // update every second
    }
  });
}

//pause timer
if (pauseBtn) {
  pauseBtn.addEventListener("click", function () {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null; // reset interval
    }
  });
}

//reset timer
if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null; // reset interval
    }

    elapsedSeconds = 0; // reset elapsed time
    renderTimer();
  });
}

renderTimer(); //initial render of timer display

//allow enter when adding a task
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTaskBtn.click();
  }
});

function createTask(text) {
  return {
    text: text,
    isCompleted: false,
    beenCompleted: false, // New property to track if points have been awarded
    id: Date.now(), // Unique ID based on timestamp
  };
}

addTaskBtn.addEventListener("click", function () {
  const text = taskInput.value.trim();
  if (text == "") return; // if empty string

  const task = createTask(text);

  const li = document.createElement("li"); // create new list item

  const checkbox = document.createElement("input"); // create checkbox
  checkbox.type = "checkbox"; // set checkbox type to checkbox

  const span = document.createElement("span"); // create span element
  span.textContent = text; // set span text content to task text

  checkbox.task = task; //associate task object with checkbox

  //creating a delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×"; // set button text
  deleteBtn.classList.add("delete-btn"); // add class to button

  deleteBtn.addEventListener("click", function () {
    li.remove(); // remove the task item from the list
  });

  checkbox.addEventListener("change", function () {
    const task = this.task;
    const isChecked = this.checked;

    task.isCompleted = isChecked; //update task completion status

    li.classList.toggle("completed", isChecked); //toggle completed class

    if (isChecked && !task.beenCompleted) {
      //if the task is checked and points haven't been awarded yet
      task.beenCompleted = true; //mark task as having been completed
      totalTasksCompleted++; //increment total tasks completed
      checkForRewards(); //check if rewards should be given
    }
  });

  li.appendChild(checkbox); // append checkbox to list item
  li.appendChild(span); // append span to list item
  li.appendChild(deleteBtn); // append delete button to list item
  taskList.appendChild(li); // append list item to task list

  taskInput.value = ""; // clear input field after adding task
});

function checkForRewards() {
  //every 2 completed tasks, award a reward
  const expectedRewards = Math.floor(totalTasksCompleted / 2);
  while (rewards.length < expectedRewards) {
    earnReward();
  }
}

function earnReward() {
  const rewardTypes = ["1", "2", "3", "4", "5"];
  const newReward = rewardTypes[rewards.length % rewardTypes.length];
  rewards.push(newReward);

  showRewardNotification(newReward);
  updateRewardsDisplay();
}

function showRewardNotification(reward) {
  alert(`Congratulations! You've earned a reward: ${reward}`);
}

function updateRewardsDisplay() {
  console.log("current rewards:", rewards);
  //TODO: Update the UI to show rewards
}
