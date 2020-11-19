const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "votecount",
  args: false,
  aliases: ["vc"],
  description: "Counts the amount of votes",
  execute: async (message) => {
    try {
      const { data } = await axios.get("https://i.tf.fi/voteresults");
      const heigts = data
        .match(/(?<=height: )\d*(?=px; )/g)
        .map((height) => Math.floor(height / 4));

      const embed = new MessageEmbed()
        .setColor("#e8ba04")
        .setTitle("Vote results")
        .addFields(
          { name: "Orange", value: heigts[0], inline: true },
          { name: "Blue", value: heigts[1], inline: true },
          { name: "Green", value: heigts[2], inline: true }
        );
      message.channel.send(embed);
    } catch (exception) {
      console.error(exception);
    }
  }
};
