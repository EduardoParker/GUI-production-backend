/*import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";*/
const { pool } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.getUsers = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users");
  res.json(rows);
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(rows);
};

module.exports.getUserMe = async (req, res, next) => {
  try {
    const { user } = req;
    const id = user.userId;
    const query = `SELECT id, email FROM users WHERE id = $1`;
    values = [id];
    const result = await pool.query(query, values);
    if (!result) {
      const validatorError = new validatorError("User not found");
      return next(validatorError);
    }

    return res.status(201).send(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = (req, res) => {
  const { email, contraseña } = req.body;
  bcrypt.hash(contraseña, 10).then((hash) =>
    pool
      .query(
        "INSERT INTO users (email, contraseña) VALUES ($1, $2) RETURNING *",
        [email, hash]
      )
      .then((user) => res.send(user.rows))
      .catch((err) =>
        res
          .status(400)
          .send({ message: "alguno de los datos es incorrecto", err })
      )
  );
};

module.exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  const { rows, rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING * ",
    [userId]
  );
  if (rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(204).json(rows[0]);
};

module.exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  const { rows } = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [data.name, data.email, userId]
  );
  return res.json(rows[0]);
};

module.exports.login = (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) {
    return res
      .status(400)
      .json({ error: "El email y la contraseña son requeridos" });
  }
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];

  pool
    .query(query, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "credenciales invalidas" });
      }
      const user = result.rows[0];
      bcrypt
        .compare(contraseña, user.contraseña)
        .then((isMatch) => {
          if (isMatch) {
            const payload = { userId: user.id };

            const token = jwt.sign(payload, "fufupapachon", {
              expiresIn: "1d",
            });
            res.status(200).json({ token });
          } else {
            res.status(401).json({ error: "credenciales invalidas" });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
