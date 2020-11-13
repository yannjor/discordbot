const tabletojson = require("tabletojson").Tabletojson;
const { MessageEmbed } = require("discord.js");
const { spaceNum, getWn8Color } = require("../utils/common");
const { TANK_STAT_LIMIT } = require("../utils/config");

module.exports = {
  name: "tankstats",
  args: true,
  description:
    "Get a World of Tanks player's statistics for a specific vehicle",
  arguments: "[player name, tank name]",
  aliases: ["ts"],
  execute: async (message, args) => {
    try {
      const tankName = args.slice(1).join(" ");
      const json = await tabletojson.convertUrl(
        `https://wot-life.com/eu/player/${args[0]}`
      );
      const allTankStats = json[json.length - 1];
      let tankStats = allTankStats.filter((tank) =>
        tank["Tank Name"].toLowerCase().includes(tankName.toLowerCase())
      );

      if (!tankStats.length) {
        return message.channel.send(`No results found for ${tankName}`);
      } else if (tankStats.length > TANK_STAT_LIMIT) {
        tankStats = tankStats.slice(-TANK_STAT_LIMIT);
        message.channel.send(`More than ${TANK_STAT_LIMIT} results found`);
      }

      const createEmbed = (tank) => {
        const description = `
        Battles: ${spaceNum(tank.Battles)}
        Victories: ${tank.Victories}
        WN8: ${tank.WN8}
        Average Damage: ${tank["Ø Damage"]}`;

        const embed = new MessageEmbed()
          .setTitle(`[${tank.Tier}] ${tank["Tank Name"]}`)
          .setColor(getWn8Color(parseInt(tank.WN8)))
          .setDescription(description);
        return embed;
      };
      
      for (const tank of tankStats) {
        message.channel.send(createEmbed(tank));
      }
    } catch (err) {
      console.error(err);
      message.channel.send(`Failed to fetch stats for: ${args[0]}.`);
    }
  }
};
