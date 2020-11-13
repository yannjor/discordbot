require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEATHER_TOKEN = process.env.WEATHER_TOKEN;
const PREFIX = process.env.PREFIX;

module.exports = {
  BOT_TOKEN,
  WEATHER_TOKEN,
  PREFIX,
};
