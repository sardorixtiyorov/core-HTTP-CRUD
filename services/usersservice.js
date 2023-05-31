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

async function createCustomer(req, res) {
  try {
    const body = await getBodyData(req);
    const { first_name, last_name, email, phone } = JSON.parse(body);
    const query =
      "INSERT INTO customers(first_name,last_name,email,phone) VALUES(?,?,?,?)";
    const values = [first_name, last_name, email, phone];
    const results = await new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
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
      message: "Customer is added",
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

async function getCustomerById(req, res, id) {
  try {
    const results = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM customers WHERE customer_id =?",
        id,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.writeHead(200, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "OK",
      customer: results,
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
async function putCustomer(req, res, id) {
  try {
    const body = await getBodyData(req);
    const { first_name, last_name, email, phone } = JSON.parse(body);
    const query =
      "UPDATE customers SET first_name =?,last_name =?,email =?,phone =? WHERE customer_id =?";
    const values = [first_name, last_name, email, phone, id];
    const results = await new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
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
      message: "Customer is updated",
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
async function deleteCustomer(req, res, id) {
  try {
    const q1 = "Delete from orders where customer_id=?";

    const results = await new Promise((resolve, reject) => {
      pool.query(q1, id, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const q2 = " DELETE FROM customers WHERE customer_id =?";
    const result = await new Promise((resolve, reject) => {
      pool.query(q2, id, (error, results) => {
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
      message: "Customer is deleted",
    };
    res.end(JSON.stringify(resp));
  } catch (error) {
    res.writeHead(500, {
      "Content-Type": "application/json charset-utf8",
    });
    const resp = {
      status: "ERROR",
      message: "o'chirilmadi",
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
  createCustomer,
  getCustomerById,
  putCustomer,
  deleteCustomer,
};
