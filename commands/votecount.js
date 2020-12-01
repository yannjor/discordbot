const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");
const { Agent } = require("https");

module.exports = {
  name: "votecount",
  args: false,
  aliases: ["vc"],
  description: "Counts the amount of votes",
  execute: async (message) => {
    try {
      // Custom agent to ignore TLS errors
      const { data } = await axios.get("https://i.tf.fi/voteresults", {
        httpsAgent: new Agent({ rejectUnauthorized: false })
      });
      const heights = data
        .match(/(?<=height: )\d*(?=px; )/g)
        .map((height) => Math.floor(height / 4));

      const embed = new MessageEmbed()
        .setColor("#e8ba04")
        .setTitle("Vote results")
        .addFields(
          { name: "Orange", value: heights[0], inline: true },
          { name: "Blue",   value: heights[1], inline: true },
          { name: "Green",  value: heights[2], inline: true }
        );
      message.channel.send(embed);
    } catch (exception) {
      message.channel.send("Failed while fetching vote count");
      console.error(exception);
    }
  }
};
