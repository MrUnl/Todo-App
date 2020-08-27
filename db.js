const fs = require("fs");
const path = require("path")
const fileName = path.join(__dirname, "todos.json")
module.exports.saveTodos = (todos) => {
    todos = JSON.stringify(todos);
    fs.writeFile(fileName, todos, function(err) {
        if (err) return console.log(err);
    });
}
const getTodos = function() {
    fs.exists(fileName, (exists) => {
        if (exists) {
            fs.readFile(fileName, 'utf8', function(err, data) {
                if (err) {
                    console.log(err, "ERROR");
                }
                let parsedData;
                if (data) {
                    parsedData = JSON.parse(data);
                } else {
                    parsedData = []
                }

                module.exports.todos = parsedData;
            });
        } else {
            fs.writeFile(fileName, "[]", () => console.log("Dosya Oluşturuldu"))
            module.exports.todos = []
        }
    })

}
getTodos()