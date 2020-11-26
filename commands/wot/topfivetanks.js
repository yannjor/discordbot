const { MessageEmbed } = require("discord.js");
const { spaceNum } = require("../../utils/common");
const { getWotLifeStats, getWn8Color } = require("../../utils/wotutils");

module.exports = {
  name: "topfivetanks",
  args: true,
  description: "Get a World of Tanks player's top 5 most played tanks",
  arguments: "[player name]",
  aliases: ["tft", "tt"],
  execute: async (message, args) => {
    try {
      const json = await getWotLifeStats(args[0]);
      const overallWn8 = parseInt(json[0][json[0].length - 1].WN8);
      const top5tanks = json[json.length - 1]
        .sort((a, b) => b.Battles - a.Battles)
        .slice(0, 5);

      const descriptions = top5tanks.map(
        (tank) => `**[${tank.Tier}] ${tank["Tank Name"]}**
      Battles: ${spaceNum(tank.Battles)}
      Victories: ${tank.Victories}
      WN8: ${tank.WN8}`
      );
      const embed = new MessageEmbed()
        .setColor(getWn8Color(overallWn8))
        .setTitle(`${args[0]}'s 5 most played tanks`)
        .setDescription(descriptions.join("\n\n"));
      message.channel.send(embed);
    } catch (err) {
      console.error(err);
      message.channel.send(`Failed to fetch top tanks for: ${args[0]}.`);
    }
  }
};
