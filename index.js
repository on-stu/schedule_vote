const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(express.static(__dirname + "/public"));

app.get("", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const unavailableItem = new Array();
let unavailableTime = new Set();

const io = new Server(server);
io.on("connection", (socket) => {
  io.emit("set_changed", { unavailableTime: Array.from(unavailableTime) });
  socket.on("onTimeButtonClicked", (time) => {
    const timeWithSid = {
      time,
      sid: socket.id,
    };
    if (
      unavailableItem.some(
        (elm) => elm.time === timeWithSid.time && elm.sid && timeWithSid.sid
      )
    ) {
      unavailableItem.pop(timeWithSid);
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
