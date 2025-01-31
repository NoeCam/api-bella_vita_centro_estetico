import express from "express";
import morgan from "morgan";

const server = express();
server.use(morgan("dev"));

server.get("/", (req, res) => {
  res.send("Hello, world!");
});

export default server;
