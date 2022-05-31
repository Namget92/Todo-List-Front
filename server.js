const http = require("http");
const fs = require("fs");
const todos = require("./todos.json");
const tempTodos = todos;

const port = 5000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );
  console.log(`${req.method} till url: ${req.url}`);
  const items = req.url.split("/");
  console.log(items);

  if (req.method === "GET") {
    if (items[1] === "posts" && parseInt(items[2]) <= tempTodos.Todos.length) {
      const postId = parseInt(items[2]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(todos.Todos[postId - 1]));
    } else if (items[1] === "posts" && items[2] === "") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(todos));
    } else {
      res.statusCode = 404;
      res.end(`Cant ${req.method} post ${items[1]}. It dosn´t exist.`);
    }
  } else if (req.method === "POST" && items[1] === "posts") {
    req.on("data", (chunk) => {
      const newTodo = JSON.parse(chunk.toString());
      newTodo.id = tempTodos.Todos.length + 1;
      newTodo.complete = false;
      tempTodos.Todos.push(newTodo);
      fs.writeFile("./todos.json", JSON.stringify(tempTodos), (error) => {
        if (error) console.log(error);
        console.log("Database updated.");
      });
    });
    res.statusCode = 201;
    res.end("Post succeeded");
  } else if (items[1] === "posts" && req.method === "PATCH") {
    if (parseInt(items[2]) <= tempTodos.Todos.length) {
      req.on("data", (chunk) => {
        const newTodo = JSON.parse(chunk.toString());
        console.log(newTodo);
        const patchId = parseInt(items[2] - 1);
        const post = tempTodos.Todos[patchId];
        if (newTodo.action) {
          post.action = newTodo.action;
          fs.writeFile("./todos.json", JSON.stringify(tempTodos), (error) => {
            if (error) console.log(error);
            console.log("Database updated.");
          });
          res.statusCode = 201;
          res.end(`${req.method} succeeded.`);
        } else if (newTodo.complete) {
          post.complete = newTodo.complete;
          fs.writeFile("./todos.json", JSON.stringify(tempTodos), (error) => {
            if (error) console.log(error);
            console.log("Database updated.");
          });
          res.statusCode = 201;
          res.end(`${req.method} succeeded.`);
        } else {
          post.complete = !post.complete;
          fs.writeFile("./todos.json", JSON.stringify(tempTodos), (error) => {
            if (error) console.log(error);
            console.log("Database updated.");
          });
          res.statusCode = 201;
          res.end(`${req.method} succeeded.`);
        }
      });
    } else {
      res.statusCode = 404;
      res.end(
        `Cant ${req.method} post${
          items[2] === ""
            ? ". Don´t forget to add the id of the post in the url e.g http://localhost:5000/posts/(id here)/"
            : ` ${items[2]} It dosn´t exist.`
        }`
      );
    }
  } else if (items[1] === "posts" && req.method === "PUT") {
    req.on("data", (chunk) => {
      if (parseInt(items[2]) <= tempTodos.Todos.length) {
        const newTodo = JSON.parse(chunk.toString());
        const patchId = parseInt(items[2] - 1);
        const post = tempTodos.Todos[patchId];
        post.complete = newTodo.complete;
        post.action = newTodo.action;
        fs.writeFile("./todos.json", JSON.stringify(tempTodos), (error) => {
          if (error) console.log(error);
          console.log("Database updated.");
        });
        res.statusCode = 201;
        res.end(`${req.method} succeeded.`);
      } else {
        res.statusCode = 404;
        res.end(
          `Cant ${req.method} post${
            items[2] === ""
              ? ". Don´t forget to add the id of the post in the url e.g http://localhost:5000/posts/(id here)/"
              : ` ${items[2]} It dosn´t exist.`
          }`
        );
      }
    });
  } else if (req.method === "DELETE" && items[1] === "posts") {
    if (parseInt(items[2]) <= tempTodos.Todos.length) {
      let number = 1;
      const patchId = parseInt(items[2] - 1);
      console.log(patchId);
      tempTodos.Todos.splice(patchId, 1);
      console.log(tempTodos.Todos);
      tempTodos.Todos.map((todo) => {
        todo.id = number;
        number++;
      });
      fs.writeFile("./todos.json", JSON.stringify(tempTodos), (error) => {
        if (error) console.log(error);
        console.log("Database updated.");
      });
      res.statusCode = 200;
      res.end(`${req.method} succeeded.`);
    } else {
      res.statusCode = 404;
      res.end(
        `Cant ${req.method} post${
          items[2] === ""
            ? ". Don´t forget to add the id of the post in the url e.g http://localhost:5000/posts/(id here)/"
            : ` ${items[2]} It dosn´t exist.`
        }`
      );
    }
  } else if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
  } else {
    res.statusCode = 404;
    res.end(
      "Something went wrong. Check if you are using the right url. Look in the README.MD file for more info."
    );
  }
});

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
