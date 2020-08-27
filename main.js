const electron = require("electron");
const url = require("url");
const path = require("path");
const db = require("./db");
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron')


let win;
let Editwin;
let isFullScreen = false

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false
    })
    win.setMinimumSize(800, 600)
    win.resizable = true;

    // and load the index.html of the app.
    win.loadFile('index.html')

    //Menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    // Menu.setApplicationMenu(mainMenu);
    win.setMenu(mainMenu)
    win.webContents.on("dom-ready", () => {
        console.log(db.todos);
        win.webContents.send("init", db.todos);
    })
    win.on("close", () => app.quit());

}

app.setUserTasks([{
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'To-Do Ekle',
    description: 'Yeni Bir To-Do Ekle'
}])

app.on('ready', createWindow)
const menuTemplate = [{
        label: "Dosya",
        submenu: [{
                label: "Tümünü Sil",
                click() {
                    win.webContents.send("allClear");
                    db.saveTodos([]);
                }
            },
            {
                label: "Çıkış",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                role: "quit"
            }
        ]
    },
    {
        label: "Dev Tools",
        submenu: [{
                label: "Dev Tools",
                role: "toggleDevTools",
                accelerator: "Ctrl+I"
            },
            {
                label: "Yenile",
                role: "reload"
            }
        ]

    }
];
ipcMain.on("app:quit", () => {
    app.quit();
})
ipcMain.on("region", (e, job) => {
    switch (job) {
        case "fullscreen":
            isFullScreen = !isFullScreen
            win.setFullScreen(isFullScreen)
            break;
        case "minimize":
            win.minimize()
            break;
        case "close":
            app.quit()
            break;
        case "close-edit":
            Editwin.close()
            break;
        case "minimize-edit":
            Editwin.minimize()
            break;
        default:
            break;
    }
})

ipcMain.on("remove:todo", (e, arg) => {
    const index = arg.todos.findIndex(todo => todo.id === arg.currentTodo.id);
    arg.todos.splice(index, 1)
    db.saveTodos(arg.todos);
    win.webContents.send("update:todo", arg.todos)
})
ipcMain.on("saveTodos", (e, todos) => {
    db.saveTodos(todos);
})
ipcMain.on("todo:edit", (e, todo) => {
    Editwin = new BrowserWindow({
        width: 475,
        height: 175,
        webPreferences: {
            nodeIntegration: true
        },
        title: "Düzenle",
        frame: false
    })
    Editwin.setAlwaysOnTop(true)
    Editwin.loadFile("edit.html");
    Editwin.setParentWindow(win)
    Editwin.webContents.on("dom-ready", () => {


        Editwin.webContents.send("init:edit", { currentTodo: todo, todos: db.todos, id: todo.id });

    })

    Editwin.resizable = false;
    //Editwin.setMenu(null);
})
ipcMain.on("editTodos", (e, editedTodos) => {
    db.todos = editedTodos;
    db.saveTodos(editedTodos)
    Editwin.close()
    win.webContents.send("init", editedTodos);
})