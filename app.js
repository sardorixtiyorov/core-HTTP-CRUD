// const axios = require("axios");
const http = require("http");
const { v4 } = require("uuid");

const getBodyData = require("./util");

const books = [
  {
    id: "1",
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    description: "A book about space exploration.",
    pages: 240,
  },
];

const server = http.createServer(async (req, res) => {
  if (req.url == "/books" && req.method == "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "OK",
      books,
    };
    res.end(JSON.stringify(resp));
  } else if (req.url == "/books" && req.method == "POST") {
    const data = await getBodyData(req);
    const { title, pages, author, description } = JSON.parse(data);
    const newBook = {
      id: v4(),
      title: title,
      author: author,
      description: description,
      pages: pages,
    };
    books.push(newBook);
    res.writeHead(201, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "Created",
      book: newBook,
    };

    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method == "GET") {
    const id = req.url.split("/")[2];
    const book = books.find((book) => book.id == id);
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    if (!book) {
      const resp = {
        status: 404,
        message: "Book not found",
      };
      res.end(JSON.stringify(resp));
    }
    const resp = {
      status: 200,
      book: book,
    };
    res.end(JSON.stringify(book));
  } else if (req.url.match(/\/books\/\w+/) && req.method == "DELETE") {
    const id = req.url.split("/")[2];
    const index = books.findIndex((book) => book.id == id);
    if (index == -1) {
      const resp = {
        status: 404,
        message: "Book not found",
      };
      res.writeHead(200, {
        "Content-Type": "application/json charset-utf8",
      });
      res.end(JSON.stringify(resp));
    } else {
      books.splice(index, 1);
      res.writeHead(200, {
        "Content-Type": "application/json charset-utf8",
      });
      const resp = {
        status: 200,
        message: "Book deleted",
      };
      res.end(JSON.stringify(resp));
    }
  } else if (req.url.match(/\/books\/\w+/) && req.method == "PUT") {
    const id = req.url.split("/")[2];
    const body = await getBodyData(req);
    const { title, pages, author, description } = JSON.parse(body);
    const bookIndex = books.findIndex((book) => book.id == id);
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    if (bookIndex == -1) {
      const resp = {
        status: 404,
        message: "Book not found",
      };
      res.end(JSON.stringify(resp));
    } else {
      const updatedBook = {
        id: id,
        title: title,
        pages: pages,
        author: author,
        description: description,
      };
      books[bookIndex] = updatedBook;
      const resp = {
        status: 200,
        message: "Book updated",
        data: updatedBook,
      };
      res.end(JSON.stringify(resp));
    }
  }
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
