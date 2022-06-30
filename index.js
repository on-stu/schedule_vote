const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.static(__dirname + "/public"));

app.get("", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let unavailableItem = new Array();
let unavailableTime = new Set();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
io.on("connection", (socket) => {
  io.emit("set_changed", { unavailableTime: Array.from(unavailableTime) });
  socket.on("onTimeButtonClicked", (time) => {
    const timeWithSid = {
      time,
      sid: socket.id,
    };

    if (
      unavailableItem.some(
        (elm) => elm.time === timeWithSid.time && elm.sid === timeWithSid.sid
      )
    ) {
      unavailableItem = unavailableItem.filter(
        (elm) => elm.time !== timeWithSid.time || elm.sid !== timeWithSid.sid
      );
    } else {
      unavailableItem.push(timeWithSid);
    }
    unavailableTime = new Set();
    unavailableItem.forEach(({ time }) => {
      if (!unavailableTime.has(time)) {
        unavailableTime.add(time);
      }
    });

    io.emit("set_changed", { unavailableTime: Array.from(unavailableTime) });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
