const electron = require("electron");
const { ipcRenderer } = electron;
const addBtn = document.querySelector("#addBtn");
const input = document.querySelector("#todoValue");


let todos = [];

function appRegion(job) {
    ipcRenderer.send("region", job)
}
/**
 * 
 * @param {Array<Todo>} todos 
 * @returns {void}
 */
function drawTodos(todos) {
    document.querySelector(".todo-container").innerHTML = "";
    if (todos.length < 1) {
        console.log("Todo Yok");
        checkTodoCount()
        return
    }
    todos.forEach(todo => {

        drawRow(todo);
    })
}

addBtn.addEventListener("click", () => {
    if (input.value == "") {
        alert("Lütfen Boş Alan Bırakmayın");
    } else {
        todos.push({
            id: todos.length,
            value: input.value
        })
        drawRow(todos[todos.length - 1]);
        input.value = "";
        ipcRenderer.send("saveTodos", todos)
    }
})


input.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            if (input.value == "") {
                alert("Lütfen Boş Alan Bırakmayın");
            } else {
                todos.push({
                    id: todos.length,
                    value: input.value
                })
                drawRow(todos[todos.length - 1]);
                input.value = "";
                ipcRenderer.send("saveTodos", todos)
            }
        }
    })
    /**
     * @typedef Todo
     * @param {Number} id
     * @param {String} value
     */
    /**
     * 
     * @param {Todo} todo 
     */
function drawRow(todo) {
    //container...
    const container = document.querySelector(".todo-container");

    // row
    const row = document.createElement("div");
    row.className = "row";

    // col
    const col = document.createElement("div");
    col.className =
        "todo-item p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center";

    // p
    const p = document.createElement("p");
    p.className = "m-0 w-100";
    p.innerText = todo.value;
    //Düzenle
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-warning flex-shrink-1 mr-2";
    editBtn.innerHTML = 'Düzenle';
    editBtn.setAttribute("data-id", todo.id);
    editBtn.addEventListener("click", () => {
        ipcRenderer.send("todo:edit", { value: todo.value, id: todo.id });
    })

    // Sil Btn
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger flex-shrink-1";
    deleteBtn.innerHTML = "X";
    deleteBtn.setAttribute("data-id", todo.id)

    deleteBtn.addEventListener("click", e => {
        if (confirm("Bu Kaydı Silmek İstediğinizden Emin misiniz?")) {
            e.target.parentNode.parentNode.remove();
            const currentTodo = todos.find(todo => todo.id == e.target.getAttribute("data-id"))
            ipcRenderer.send("remove:todo", { currentTodo, todos: todos })
            checkTodoCount();
        }
    });

    col.appendChild(p);
    col.appendChild(editBtn);
    col.appendChild(deleteBtn);


    row.appendChild(col);

    container.appendChild(row);
    checkTodoCount();
}
ipcRenderer.on("update:todo", (e, updatedTodos) => {
    todos = updatedTodos;
})

function checkTodoCount() {
    const container = document.querySelector(".todo-container");
    const alertContainer = document.querySelector(".alert-container");
    document.querySelector(".total-count-container").innerText =
        container.children.length;

    if (container.children.length !== 0) {
        alertContainer.style.display = "none";
    } else {
        alertContainer.style.display = "block";
    }
}

ipcRenderer.on("init", (e, toDos) => {
    todos = toDos;

    drawTodos(toDos)
})
ipcRenderer.on("allClear", () => {
    todos = [];
    document.querySelector(".todo-container").innerHTML = "";
    document.querySelector(".alert-container").style.display = "block";
})