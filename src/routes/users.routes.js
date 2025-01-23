//import { Router } from "express";
//import { pool } from "../db.js";
/*import {
  createUser,
  deleteUser,
  getUser,
  getUserMe,
  getUsers,
  updateUser,
} from "../controllers/users.controllers.js";*/
const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const { getUserMe } = require("../controllers/users.controllers.js");

//const router = Router();

//router.get("/users", getUsers);
router.get("/users/me", auth, getUserMe);
//router.get("/users/:userId", getUser);
//router.post("/users", createUser);
//router.delete("/users/:userId", deleteUser);
//router.put("/users/:userId", updateUser);

//export default router;
module.exports = router;
