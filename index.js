// autoNotify/index.js
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

const url = 'https://notify-api.line.me/api/notify';

const sendNotification = async (message) => {
  try {
    const response = await axios.post(
      url,
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
// 定時任務，每周一到五的上午 12:30 運行
cron.schedule('20 12 * * 1-5', () => {
  sendNotification('Hello, This is a message from Render!');
  }, {
    timezone: 'Asia/Taipei'  
  });

console.log('Cron job scheduled.');
