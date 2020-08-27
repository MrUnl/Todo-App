const { ipcRenderer } = require("electron")
let todos = []
let currentTodo = {}
const input = document.querySelector("#editValue")
    //EDIT JS
function appRegion(job) {
    ipcRenderer.send("region", job + "-edit")
}

ipcRenderer.on("init:edit", (_e, arg) => {
    input.value = arg.currentTodo.value;
    document.querySelector("#editBtn").setAttribute("data-id", arg.currentTodo.id);
    todos = arg.todos
    currentTodo = arg.currentTodo
});
document.querySelector("#editBtn").addEventListener("click", () => {
    const index = todos.findIndex(to_do => {
        console.log(to_do.id, currentTodo.id);
        return to_do.id === currentTodo.id
    });
    console.log(index);
    todos[index].value = input.value;
    console.log(todos);
    ipcRenderer.send("editTodos", todos);

});