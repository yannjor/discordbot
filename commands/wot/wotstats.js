const { MessageEmbed } = require("discord.js");
const { spaceNum } = require("../../utils/common");
const { getWn8Color, getWotLifeStats } = require("../../utils/wotutils");

module.exports = {
  name: "wotstats",
  args: true,
  description: "Get a World of Tanks player's statistics",
  arguments: "[player name]",
  aliases: ["ws"],
  execute: async (message, args) => {
    try {
      const json = await getWotLifeStats(args[0]);
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
