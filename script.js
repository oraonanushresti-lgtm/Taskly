const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Support tasks saved by the previous version
tasks = tasks.map((task, index) => ({
    id: task.id || Date.now() + index,
    text: task.text,
    completed: task.completed || false,
    priority: task.priority || "Medium"
}));

let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display current date
document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Update dashboard statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressPercent").textContent = percent + "%";
    document.getElementById("progressBar").style.width = percent + "%";
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    const labels = {
        all: "All Tasks",
        pending: "Pending Tasks",
        completed: "Completed Tasks"
    };

    document.getElementById("filterLabel").textContent =
        labels[currentFilter];

    if (filteredTasks.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = "✨ No tasks here. Add something new!";
        taskList.appendChild(empty);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        // Task details
        const info = document.createElement("div");
        info.className = "task-info";

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.text;

        if (task.completed) {
            name.classList.add("done");
        }

        info.appendChild(name);

        // Priority
        const priority = document.createElement("span");
        priority.className = "priority-tag " + task.priority;
        priority.textContent = task.priority;

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(info);
        li.appendChild(priority);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateStats();
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false,
        priority: priorityInput.value
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

// Add button
document.getElementById("addButton")
    .addEventListener("click", addTask);

// Enter key support
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Sidebar filters
document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        displayTasks();
    });
});

// Load saved tasks
displayTasks();