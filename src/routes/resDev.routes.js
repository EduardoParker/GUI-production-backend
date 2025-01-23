/*import { Router } from "express";
import { pool } from "../db.js";
import {
  developerReport,
  insertData,
  mensualReport,
  mentorReport,
} from "../controllers/insertAndQuerys.controllers.js";*/
const router = require("express").Router();
const auth = require("../middlewares/auth.js");

const {
  developerReport,
  insertData,
  mensualReport,
  mentorReport,
} = require("../controllers/insertAndQuerys.controllers.js");

//const router = Router();

router.post("/insertar-datos", insertData);
router.post("/reporte-mensual", mensualReport);
router.post("/reporte-desarrollador", developerReport);
router.post("/reporte-mentor", mentorReport);

//export default router;
module.exports = router;
