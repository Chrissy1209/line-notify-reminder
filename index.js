// autoNotify/index.js
const http = require('http');
const axios = require("axios");
const cron = require("node-cron");
require("dotenv").config();

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;
const notifyUrl = "https://notify-api.line.me/api/notify";

const sendNotification = async (message) => {
  try {
    const response = await axios.post(
      notifyUrl,
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          "Authorization": `Bearer ${LINE_NOTIFY_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

//---

const notifyMessage = (data) => {
  let message = "☀️ 今日氣象預報\n\n";

  data.location.forEach((loc) => {
    const weatherElements = loc.weatherElement;
    message += `📌${loc.locationName}\n`;

    const Wx = weatherElements.find((e) => e.elementName === "Wx").time;
    const PoP = weatherElements.find((e) => e.elementName === "PoP").time;
    const MinT = weatherElements.find((e) => e.elementName === "MinT").time;
    const MaxT = weatherElements.find((e) => e.elementName === "MaxT").time;
    const CI = weatherElements.find((e) => e.elementName === "CI").time;

    for (let i = 0; i < Wx.length; i++) {
      message += `${Wx[i].startTime.slice(11, 16)}\n`;
      message += `🌤 ${Wx[i].parameter.parameterName}\n`;
      message += `🌡 最低溫度: ${MinT[i].parameter.parameterName}°C\n`;
      message += `🌡 最高溫度: ${MaxT[i].parameter.parameterName}°C\n`;
      message += `🌂 降雨機率: ${PoP[i].parameter.parameterName}%\n`;
      message += `🌀 ${CI[i].parameter.parameterName}\n`;
    }
  });
  return message;
};

const WEATHER_AUTHORIZATION = process.env.WEATHER_AUTHORIZATION;
const taipei = "%E8%87%BA%E5%8C%97%E5%B8%82";
const taoyuan = "%E6%A1%83%E5%9C%92%E5%B8%82";

const sendWeatherForecast = async (locationName) => {
  const forecastUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${WEATHER_AUTHORIZATION}&format=JSON&locationName=${locationName ==='taipei' ? taipei : taoyuan}`;
  let myMessage = "";

  try {
    const response = await axios.get(forecastUrl, {
      headers: {
        accept: "application/json",
      },
    });

    myMessage = notifyMessage(response.data.records);
    sendNotification(myMessage);
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

//--- 

cron.schedule(
  "*/5 * * * *",
  () => {
    console.log("Running task for Taipei");
    sendWeatherForecast('taipei').catch(err => console.error("Error in Taipei task:", err));
  },
  {
    timezone: "Asia/Taipei",
  }
);

cron.schedule(
  "30 08 * * 6-7",
  () => {
    console.log("Running task for Taoyuan");
    sendWeatherForecast('taoyuan').catch(err => console.error("Error in Taoyuan task:", err));
  },
  {
    timezone: "Asia/Taipei",
  }
);

//---

const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, this is a simple web service to keep Render happy!');
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
