const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const rewardItems = document.getElementById("rewardItems");
const resetRewardsBtn = document.getElementById("resetRewardsBtn");

if (resetRewardsBtn) {
  resetRewardsBtn.addEventListener("click", function () {
    rewards = [];
    totalTasksCompleted = 0;
    saveState();
    updateRewardsDisplay();
  });
}

// Timer variables
let elapsedSeconds = 0;
let timerInterval = null; //controls start and stop

//award point variables
let totalTasksCompleted = 0;
let rewards = [];

//adding local storage functionality
let tasks = [];

//adding the rewards images
const rewardCatalog = [
  "assets/images/pufferfish.svg",
  "assets/images/shark.svg",
  "assets/images/deer.svg",
  "assets/images/elephant.svg",
  "assets/images/fish.svg",
  "assets/images/gorilla.svg",
  "assets/images/monkey.svg",
  "assets/images/octopus.svg",
  "assets/images/rat.svg",
  "assets/images/whale.svg",
  "assets/images/wolf.svg",
];

function saveState() {
  const data = {
    tasks,
    rewards,
    totalTasksCompleted,
  };
  localStorage.setItem("gamifiedTodoState", JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem("gamifiedTodoState");
  if (!raw) return;

  const data = JSON.parse(raw);
  tasks = data.tasks || [];
  rewards = data.rewards || [];
  totalTasksCompleted = data.totalTasksCompleted || 0;
}

function renderAllTasks() {
  if (!taskList) return;

  taskList.innerHTML = ""; //clear existing tasks
  tasks.forEach((task) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.isCompleted;

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("delete-btn");

    li.classList.toggle("completed", task.isCompleted);

    deleteBtn.addEventListener("click", function () {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveState();
      renderAllTasks();
    });

    checkbox.addEventListener("change", function () {
      task.isCompleted = checkbox.checked;
      li.classList.toggle("completed", task.isCompleted);

      if (checkbox.checked && !task.beenCompleted) {
        task.beenCompleted = true;
        totalTasksCompleted++;
        checkForRewards();
      }

      saveState();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

loadState();
updateRewardsDisplay();
renderAllTasks();

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
if (taskInput && addTaskBtn) {
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTaskBtn.click();
    }
  });
}

function createTask(text) {
  return {
    text: text,
    isCompleted: false,
    beenCompleted: false, // New property to track if points have been awarded
    id: Date.now(), // Unique ID based on timestamp
  };
}
if (addTaskBtn && taskInput) {
  addTaskBtn.addEventListener("click", function () {
    const text = taskInput.value.trim();
    if (text == "") return; // if empty string

    const task = createTask(text);
    tasks.push(task);
    saveState();
    renderAllTasks();
    taskInput.value = ""; //clear input
  });
}

function checkForRewards() {
  //every 2 completed tasks, award a reward
  const expectedRewards = Math.floor(totalTasksCompleted / 2);
  while (rewards.length < expectedRewards) {
    earnReward();
  }
}

function earnReward() {
  const rewardTypes = ["🤣", "🥹", "😇", "🧐", "🤩"];
  const newReward = rewardTypes[rewards.length % rewardTypes.length];
  rewards.push(newReward);

  showRewardNotification(newReward);
  updateRewardsDisplay();
  saveState();
}

function showRewardNotification(reward) {
  const toast = document.getElementById("rewardToast");
  if (!toast) return;

  toast.textContent = `You earned a new reward! Go check it out!`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}

function updateRewardsDisplay() {
  if (!rewardItems) return;

  rewardItems.innerHTML = ""; //clear existing rewards

  rewardCatalog.forEach((src, index) => {
    const item = document.createElement("div");
    item.classList.add("reward-item");

    if (index >= rewards.length) {
      item.classList.add("locked"); //locked reward
    }

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Reward";

    item.appendChild(img);
    rewardItems.appendChild(item);
  });
}
