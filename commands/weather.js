const { getWeather } = require("../utils/common");
const { WEATHER_TOKEN } = require("../utils/config");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "weather",
  args: false,
  description: "Get the current weather in a city",
  arguments: "[city name]",
  execute: async (message, args) => {
    let argument;

    if (!args.length) {
      argument = "munkkiniemi";
    } else {
      argument = args
        .join(" ")
        .toLowerCase()
        .replace(/\u00e4/g, "a") // Replace ä & å with a
        .replace(/\u00e5/g, "a");
    }

    const weather = await getWeather(argument, WEATHER_TOKEN);

    if (!weather) {
      return message.channel.send(
        `Failed to fetch weather for **${argument}**`
      );
    }

    const { city, country, temp, wind, pressure, humidity, icon } = weather;

    const embed = new MessageEmbed()
      .setColor("#3f3f3f")
      .setTitle(`Weather in ${city}, ${country}`)
      .setDescription(
        `Temperature: ${temp}°C
        Wind: ${wind} m/s
        Pressure: ${pressure} hPa
        Humidity: ${humidity}%`
      )
      .setImage(icon);

    message.channel.send(embed);
  }
};
