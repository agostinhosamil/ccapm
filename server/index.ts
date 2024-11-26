import "express-async-errors";

import cors from "cors";
import express from "express";
import { createServer } from "http";
import { SignalData } from "simple-peer";
import { Server } from "socket.io";

import meets, { createMeet } from "server@data/meet";
import { allowedOrigin } from "server@utils/allowedOrigin";

import { env } from "./config/env";

const app = express();
const server = createServer(app);

const getUsersInRoom = (io: Server, roomToken: string) => {
  //this is an ES6 Set of all client ids in the room
  const clients = io.sockets.adapter.rooms.get(roomToken);

  //to get the number of clients in this room
  const numClients = clients ? clients.size : 0;

  return numClients;
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigin(String(origin))) {
        return callback(null, origin);
      }

      return callback(new Error("Unauthorized"));
    },
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ hey: "Man" });
});

type JoinMeetEvent = {
  meetToken: string;
  userId: string;
  signal: SignalData;
};

const userIsDoctor = async () =>
  // TODO: make sure user could start a meet
  true;

io.on("connection", (socket) => {
  socket.send({ data: "user", user: { name: "Sam" } });

  socket.on("message", (message) => console.log({ message }));

  socket.on(
    "join-meet",
    async ({ meetToken, userId, signal }: JoinMeetEvent) => {
      if (socket.rooms.has(meetToken)) {
        return;
      }

      socket.join(meetToken);

      // await createMeet(meetToken);
      // await meets.addMember(meetToken, userId);

      socket.to(meetToken).emit("user-joined", { userId, meetToken, signal });
    }
  );

  socket.on("start-meet", async ({ meetToken, userId }: JoinMeetEvent) => {
    if (socket.rooms.has(meetToken)) {
      return;
    }

    // TODO: make sure user could start a meet
    if (!(await userIsDoctor())) {
      return;
    }

    await createMeet(meetToken, true);
    await meets.addMember(meetToken, userId);

    socket.join(meetToken);

    // socket.to(meetToken).emit("user-joined", { userId, meetToken, signal });
  });
});

server.listen(env.PORT, () => {
  console.log(`\n\n\t>>> [NODE] Server listening on port ${env.PORT}\n\n`);
});
