const form = document.getElementById("form");
const input = document.getElementById("title_input");
const tasksList = document.getElementById("tasks_list");
const completedList = document.getElementById("completed_list");
const tasksCount = document.getElementById("tasks_count");
const completedCount = document.getElementById("completed_count");

const API_URL = "http://127.0.0.1:8000/todos";

async function loadTodos() {
  const response = await fetch(API_URL);
  const todos = await response.json();

  tasksList.innerHTML = "";
  completedList.innerHTML = "";

  let active = 0;
  let completed = 0;

  todos.forEach((todo) => {
    if (todo.completed) {
      completed++;
      completedList.innerHTML += `
              <li class = "list_element list_element_completed">
          <p>${todo.title}</p>
          <div>
            <button onclick="deleteTodo(${todo.id})"><img src="src/TrashSimple.svg" alt="delete" /></button>
          </div>
        </li>
`;
    } else {
      active++;
      tasksList.innerHTML += `        <li class = "list_element">
          <p>${todo.title}</p>
          <div>
      <button onclick="completeTodo(${todo.id}, '${todo.title.replace(
        /'/g,
        "\\'"
      )}')"><img src="src/Check.svg" alt="Check" /></button>

            <button onclick="deleteTodo(${
              todo.id
            })"><img src="src/TrashSimple.svg" alt="delete" /></button>
          </div>
        </li>
`;
    }
  });
  tasksCount.textContent = `Tasks to do - ${active}`;
  completedCount.textContent = `Completed - ${completed}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const todo = {
    title: input.value,
  };
  const response = await fetch("http://127.0.0.1:8000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (response.ok) {
    const data = await response.json();
    alert("Todo was added");
    console.log(data);
  } else {
    alert("Error adding todo");
  }
  loadTodos();
});
//
async function completeTodo(id, title) {
  title = decodeURIComponent(title);
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, completed: true }),
  });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  loadTodos();
}

loadTodos();
