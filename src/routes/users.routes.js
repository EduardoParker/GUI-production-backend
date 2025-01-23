const router = require("express").Router();
const auth = require("../middlewares/auth.js");
const { getUserMe } = require("../controllers/users.controllers.js");

router.get("/users/me", auth, getUserMe);

module.exports = router;
