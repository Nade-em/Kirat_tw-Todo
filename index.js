const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let todos = [];

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get("/todos", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);

    res.json(todos);
  });
});

app.get("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    res.json(todos[todoIndex]);
  }
});

app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 100),
    title: req.body.title,
    description: req.body.description,
  };

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) throw err;

    const existingTodos = JSON.parse(data);

    existingTodos.push(newTodo);

    fs.writeFile("data.json", JSON.stringify(existingTodos), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
});

app.delete("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send(req.params.id);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Listening on port", port);
});

module.exports = app;

// const express = require('express');
// const bodyParser = require("body-parser");
// const app = express();
// const port = 3000;
// const path = require("path");
// const fs = require("fs");

// const cors = require('cors');

// app.use(cors());
// app.use(bodyParser.json());
// let todos = [];

// const findIndex = (todo, id) => {
//   for (let i = 0; i < todo.length; i++) {
//     if (todo[i].id === id) {
//       return i;
//     }
//   }
//   return -1;
// }
// const removeEle = (todo, index) => {
//   let newArr = [];
//   for (let i = 0; i < todo.length; i++) {
//     if (i != index) {
//       newArr.push(todo[i])
//     }
//   }
//   return newArr;
// }

// app.post("/todos", (req, res) => {
//   let newTodo = {
//     "id": Math.floor(Math.random() * 100),
//     "title": req.body.title,
//     "description": req.body.description
//   }

//   // todos.push(newTodo);
//   // ct++;
//   // res.send(`Updated ${ct} todos`)
//   fs.readFile("data.json", "utf8", (err, data) => {
//     if (err) throw err;
//     const todos = JSON.parse(data)
//     todos.push(newTodo)
//     fs.writeFile("data.json", JSON.stringify(todos), (err) => {
//       if (err) throw err;
//       res.status(200).send(newTodo);
//     })
//   })

// })

// app.delete("/todos/:id", (req, res) => {
//   let index = findIndex(todos, parseInt(req.params.id))
//   if (index === -1) {
//     res.status(404).send("Not found")
//   }
//   else {
//     todos = removeEle(todos, index)
//     res.status(200).send()
//   }
// })
// app.get("/todos", (req, res) => {
//   res.send(todos)
// })
// // update todo
// app.put("/todos/:id", (req, res) => {
//   let index = findIndex(todos, parseInt(req.params.id))
//   if (index === -1) {
//     res.status(404).send()
//   }
//   else {
//     todos[index].title = req.body.title
//     todos[index].description = req.body.description

//   }
//   res.status(200).send(todos[index]);
// })
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

// app.listen(port);
