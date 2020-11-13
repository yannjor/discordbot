const { getCoronaStats, spaceNum } = require("../utils/common");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "corona",
  args: false,
  aliases: ["rona", "covid"],
  description: "Get corona stats for a country (default finland)",
  arguments: "[country name]",
  execute: async (message, args) => {
    let argument = args.length ? args.join("-") : "finland";

    const aliases = {
      usa: "united-states",
      uk: "united-kingdom",
      us: "united-states"
    };

    if (argument in aliases) {
      argument = aliases[argument];
    }

    const data = await getCoronaStats(argument);

    if (!data) {
      return message.channel.send("Failed to fetch corona data.");
    }

    const {
      Deaths,
      Confirmed,
      newCases,
      newDeaths,
      Recovered,
      newRecovered,
      Country,
      Date
    } = data;

    const description = `😷 Confirmed cases: ${spaceNum(
      Confirmed
    )} (+${spaceNum(newCases)})
    \n💀 Deaths: ${spaceNum(Deaths)} (+${spaceNum(newDeaths)}) 
    \n🙂 Recovered: ${spaceNum(Recovered)} (+${spaceNum(newRecovered)})`;

    const embed = new MessageEmbed()
      .setColor("#b52e0c")
      .setTitle(`Corona stats in ${Country}`)
      .setDescription(description)
      .setFooter(`Updated: ${Date.slice(0, 10)}\nSource: Johns Hopkins CSSE`);
    message.channel.send(embed);
  }
};
