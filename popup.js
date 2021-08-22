const newTaskButton = document.querySelector(".add-task");
const input = document.querySelector(".input-bar");
const taskList = document.querySelector(".task-list");

newTaskButton.addEventListener("click", addTask);
taskList.addEventListener("click", deleteTask);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", getTasks());
} else {
  getTasks();
}

function addTask(event) {
  if (input.value === "") {
    alert("Please enter a valid task/search");

    return;
  }
  // creating new task
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  const newTask = document.createElement("li");

  // task delete button
  const deleteButton = document.createElement("button");
  // deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.innerHTML = "✓";
  deleteButton.classList.add("delete-button");
  taskDiv.appendChild(deleteButton);
  // task text content
  newTask.innerText = input.value;
  newTask.classList.add("task-item");
  taskDiv.appendChild(newTask);

  // save the task to local storage
  saveLocalTasks(input.value);

  taskList.appendChild(taskDiv);
  input.value = "";
}

function deleteTask(event) {
  const item = event.target;
  if (item.classList[0] === "delete-button") {
    const task = item.parentElement;
    console.log(item.parentElement);
    task.classList.toggle("fall");
    deleteLocalTask(task);

    task.addEventListener("transitionend", function () {
      task.remove();
    });
  }
}

function deleteLocalTask(task) {
  let tasks;
  // check if already tasks saved

  chrome.storage.sync.get("tasks", function (item) {
    if (typeof item.tasks === "undefined") {
      tasks = [];
    } else {
      chrome.storage.sync.get("tasks", function (result) {
        tasks = JSON.parse(result.tasks);
        const index = task.children[0].innerText;
        tasks.splice(tasks.indexOf(index), 1);
        console.log(tasks);
        chrome.storage.sync.set({ tasks: JSON.stringify(tasks) });
      });
    }
  });
}

function saveLocalTasks(task) {
  let tasks;

  chrome.storage.sync.get("tasks", function (item) {
    if (typeof item.tasks === "undefined") {
      tasks = [];
    } else {
      chrome.storage.sync.get("tasks", function (result) {
        tasks = JSON.parse(result.tasks);
        tasks.push(task);
        console.log(tasks);
        chrome.storage.sync.set({ tasks: JSON.stringify(tasks) });
      });
    }
  });
}

function getTasks() {
  let tasks;
  console.log("is this working 2");

  chrome.storage.sync.get("tasks", function (item) {
    if (typeof item.tasks === "undefined") {
      tasks = [];
    } else {
      chrome.storage.sync.get("tasks", function (result) {
        tasks = JSON.parse(result.tasks);

        tasks.forEach(function (task) {
          // creating new task
          const taskDiv = document.createElement("div");
          taskDiv.classList.add("task");
          const newTask = document.createElement("li");

          // task delete button
          const deleteButton = document.createElement("button");
          // deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteButton.innerHTML = "✓";

          deleteButton.classList.add("delete-button");
          taskDiv.appendChild(deleteButton);

          // task text content
          newTask.innerText = task;
          newTask.classList.add("task-item");
          taskDiv.appendChild(newTask);

          // task done button
          // const doneButton = document.createElement("button");
          // doneButton.innerHTML = '<i class="fas fa-check"></i>';
          // doneButton.classList.add("done-button");
          // taskDiv.appendChild(doneButton);

          taskList.appendChild(taskDiv);
          input.value = "";
        });
      });
    }
  });
  // check if already tasks saved
  //   if (chrome.storage.sync.get(["tasks"]) === null) {
  //     tasks = [];
  //   } else {
  //     tasks = JSON.parse(chrome.storage.sync.get(["tasks"]));
  //     var h1Tag = document.createElement("h3");
  //     h1Tag.innerHTML = "TODAY'S TASKS";
  //     h1Tag.classList.add("today-title");
  //     $(".task-section").prepend(h1Tag);
  //   }
}
