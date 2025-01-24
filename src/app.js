const express = require("express");
const userRoutes = require("./routes/users.routes.js");
const dataRoutes = require("./routes/resDev.routes.js");
var cors = require("cors");
const { login, createUser } = require("./controllers/users.controllers.js");
const { celebrate, Joi, erros } = require("celebrate");

const app = express();
const PORT = 3001;

app.use(express.json());

app.use(cors());
app.options("*", cors());

const allowedCords = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://master-in-heaven.mooo.com",
  "https://www.master-in-heaven.mooo.com",
];
app.use(function (req, res, next) {
  const { origin } = req.headers;
  if (allowedCords.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
  }
  const requestHeaders = req.headers["access-control-request-headers"];
  if (method === "OPTIONS") {
    // permitir solicitudes de dominio cruzado con estos encabezados
    res.header("Access-Control-Allow-Headers", requestHeaders);
    // terminar de procesar la solicitud y devolver el resultado al cliente
    return res.end();
  }
  next();
});

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

app.use(userRoutes);
app.use(dataRoutes);
app.post(
  "/inicio-sesion",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      contraseña: Joi.string().required().min(8),
    }),
  }),
  login
);

app.post(
  "/registro",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      contraseña: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.listen(PORT);

console.log("server on port", PORT);
