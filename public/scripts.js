import { io } from "socket.io-client";

const socket = io("http://localhost:3000/");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const javascriptStyle = document.getElementById("javascriptStyle");

const calendarDiv = document.querySelector("#calendar");

function displayDate(day) {
  const eachDate = document.createElement("div");
  eachDate.className = "eachDate";
  const title = document.createElement("h2");
  title.innerText = `${day.getMonth() + 1}월 ${day.getDate()}일 ${getDayString(
    day
  )}`;
  eachDate.append(title);
  displayTime(day, eachDate);
  calendarDiv.append(eachDate);
}

function displayTime(day, eachDate) {
  const timeContainerDiv = document.createElement("div");
  timeContainerDiv.className = "timeContainer";
  for (var i = 9; i < 23; i++) {
    const dateArgs = `${day.getFullYear()}-${getMonthString(
      day.getMonth()
    )}-${getDateString(day.getDate())}T${getTimeString(i)}`;
    const tempTime = new Date(dateArgs);
    const timeButton = document.createElement("button");
    timeButton.className = "time" + tempTime.getTime();
    timeButton.addEventListener("click", () => timeButtonOnClick(tempTime));
    timeButton.innerText = getTimeString(tempTime.getHours());
    timeContainerDiv.appendChild(timeButton);
  }
  eachDate.append(timeContainerDiv);
}

function getDateString(day) {
  if (day < 10) {
    return `0${day}`;
  } else {
    return `${day}`;
  }
}

function getMonthString(month) {
  if (month < 9) {
    return `0${month + 1}`;
  } else {
    return `${month + 1}`;
  }
}

function getTimeString(time) {
  if (time < 10) {
    return `0${time}:00`;
  } else {
    return `${time}:00`;
  }
}

function getDayString(day) {
  switch (day.getDay()) {
    case 1:
      return "월";
    case 2:
      return "화";
    case 3:
      return "수";
    case 4:
      return "목";
    case 5:
      return "금";
    case 6:
      return "토";
    default:
      return "일";
  }
}

function timeButtonOnClick(time) {
  socket.emit("onTimeButtonClicked", time);
}

const today = new Date();
const nextMonday = today.addDays(5);

for (var i = 0; i < 7; i++) {
  let tempDay = nextMonday.addDays(i);
  displayDate(tempDay);
}

socket.on("set_changed", ({ unavailableTime }) => {
  javascriptStyle.innerHTML = ``;
  unavailableTime.forEach((time) => {
    const tempTime = new Date(time);
    javascriptStyle.innerHTML += `.time${tempTime.getTime()} {
      background-color: #e67e22;
    }\n`;
  });
});
