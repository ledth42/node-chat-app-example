const moment = require('moment');

const generateMessage = (from, message) => ({
  from,
  message,
  createdAt: moment().valueOf(),
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt: moment().valueOf(),
});

module.exports = { generateMessage, generateLocationMessage };
