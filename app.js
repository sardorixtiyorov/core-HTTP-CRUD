const http = require("http");
const {
  getUsers,
  postUsers,
  deleteUser,
  putUser,
  getCustomers,
} = require("./services/usersservice");

const server = http.createServer(async (req, res) => {
  if (req.url == "/users" && req.method == "GET") {
    getUsers(req, res);
  } else if (req.url == "/users" && req.method == "POST") {
    postUsers(req, res);
  } else if (req.url.match(/\/users\/\w+/) && req.method == "DELETE") {
    const id = req.url.split("/")[2];
    deleteUser(req, res, id);
  } else if (req.url.match(/\/users\/\w+/) && req.method == "PUT") {
    const id = req.url.split("/")[2];
    putUser(req, res, id);
  } else if (req.url == "/customers" && req.method == "GET") {
    getCustomers(req, res);
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
