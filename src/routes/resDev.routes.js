const router = require("express").Router();
const auth = require("../middlewares/auth.js");

const {
  developerReport,
  insertData,
  mensualReport,
  mentorReport,
} = require("../controllers/insertAndQuerys.controllers.js");

router.post("/insertar-datos", insertData);
router.post("/reporte-mensual", mensualReport);
router.post("/reporte-desarrollador", developerReport);
router.post("/reporte-mentor", mentorReport);

module.exports = router;
