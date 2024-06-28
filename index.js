// autoNotify/index.js
const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

// const token = 'Ok0XOEqY6ssPj2YUQLDVCd1K0FZKCNshwdczrACKKtq';
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

sendNotification();

// 定時任務，每周一到五的上午 8:30 運行
cron.schedule('10 10 * * 1-5', () => {
    sendLineNotify('Hello, This is a message from Render!');
  }, {
    timezone: 'Asia/Taipei'  
  });
