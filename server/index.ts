import "express-async-errors";

import express from "express";
import http from "http";
import { Server } from "socket.io";

import { env } from "./config/env";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(() => {})

app.get("/", (req, res) => {
  res.json({ hey: "Man" });
});

io.on("connection", (socket) => {
  socket.send({ data: "user", user: { name: "Sam" } });
});

server.listen(env.PORT, () => {
  console.log(`\n\n\t>>> [NODE] Server listening on port ${env.PORT}\n\n`);
});
