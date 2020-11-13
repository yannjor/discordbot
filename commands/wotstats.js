const tabletojson = require("tabletojson").Tabletojson;
const { MessageEmbed } = require("discord.js");
const { spaceNum } = require("../utils/common");

module.exports = {
  name: "wotstats",
  args: true,
  description: "Get a World of Tanks player's statistics",
  arguments: "[player name]",
  aliases: ["ws"],
  execute: async (message, args) => {
    const getWn8Color = (wn8) => {
      if (wn8 < 300) return "#930d0d";
      else if (wn8 < 450) return "#cd3333";
      else if (wn8 < 650) return "#cc7a00";
      else if (wn8 < 900) return "#ccb800";
      else if (wn8 < 1200) return "#849b24";
      else if (wn8 < 1600) return "#4d7326";
      else if (wn8 < 2000) return "#4099bf";
      else if (wn8 < 2450) return "#3972c6";
      else if (wn8 < 2900) return "#793db6";
      else return "#401070";
    };

    try {
      const json = await tabletojson.convertUrl(
        `https://wot-life.com/eu/player/${args[0]}`
      );

      const overallStats = json[0][json[0].length - 1];
      const description = `Win ratio: ${json[0][3]["Past 24 hours"]}
        Battles: ${spaceNum(json[0][1]["WN8"])}
        Overall WN8: ${overallStats.WN8}
        \nLast 24 hours: ${overallStats["Past 24 hours"]}
        Last 7 days: ${overallStats["Past 7 days"]}
        Last 30 days: ${overallStats["Past 30 days"]}`;

      const embed = new MessageEmbed()
        .setTitle(`${args[0]}'s stats`)
        .setColor(getWn8Color(parseInt(overallStats.WN8)))
        .setDescription(description);

      message.channel.send(embed);
    } catch (err) {
      console.error(err);
      message.channel.send(`Failed to fetch stats for: ${args[0]}.`);
    }
  }
};
