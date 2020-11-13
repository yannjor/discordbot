require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEATHER_TOKEN = process.env.WEATHER_TOKEN;
const PREFIX = process.env.PREFIX;
const TANK_STAT_LIMIT = 3;

module.exports = {
  BOT_TOKEN,
  WEATHER_TOKEN,
  PREFIX,
  TANK_STAT_LIMIT
};
