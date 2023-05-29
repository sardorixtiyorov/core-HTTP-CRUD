const { v4 } = require("uuid");
const getBodyData = require("../helpers/util");
const { users } = require("../models/usersmodel");

const pool = require("../config/database/connect");

async function getUsers(req, res) {
  try {
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "OK",
      users,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {}
}

async function postUsers(req, res) {
  try {
    const body = await getBodyData(req);
    const { name, email, password } = JSON.parse(body);
    const id = v4();
    const newuser = {
      id: id,
      name: name,
      email: email,
      password: password,
    };
    users.push(newuser);

    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "OK",
      message: "User is added",
    };
    res.end(JSON.stringify(resp));
  } catch (error) {}
}

async function deleteUser(req, res, id) {
  try {
    const idx = users.findIndex((user) => user.id == id);
    if (idx != -1) {
      users.splice(idx, 1);
      res.writeHead(200, {
        "Content-Type": "application/json charset-utf8",
      });
      const resp = {
        status: "OK",
        message: "User is deleted",
      };
      res.end(JSON.stringify(resp));
    } else {
      res.writeHead(404, {
        "Content-Type": "application/json charset-utf8",
      });
      const resp = {
        status: "ERROR",
        message: "User not found",
      };
      res.end(JSON.stringify(resp));
    }
  } catch (error) {}
}
async function putUser(req, res, id) {
  try {
    const body = await getBodyData(req);
    const { name, email, password } = JSON.parse(body);
    const idx = users.findIndex((user) => user.id == id);
    if (idx > -1) {
      const newuser = {
        id,
        name: name,
        email: email,
        password: password,
      };
      users[idx] = newuser;
      res.writeHead(200, {
        "Content-Type": "application/json charset-utf8",
      });
      const resp = {
        status: "OK",
        user: {
          id,
          name: name,
          email: email,
          password: password,
        },
        message: "user is added",
      };
      res.end(JSON.stringify(resp));
    } else {
      res.writeHead(404, {
        "Content-Type": "application/json charset-utf8",
      });
      const resp = {
        status: "ERROR",
        message: "User not found",
      };
      res.end(JSON.stringify(resp));
    }
  } catch (error) {}
}
async function getCustomers(req, res) {
  try {
    const results = await new Promise((resolve, reject) => {
      pool.query("SELECT * FROM customers", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "OK",
      customers: results,
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    res.writeHead(500, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "ERROR",
      message: error,
    };
    res.end(JSON.stringify(resp));
  }
}

module.exports = {
  getUsers,
  postUsers,
  deleteUser,
  putUser,
  getCustomers,
};
