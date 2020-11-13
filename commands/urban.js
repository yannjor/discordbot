const querystring = require("querystring");
const { getUrbanDictionaryQuery } = require("../utils/common");
const { MessageEmbed } = require("discord.js");

// Make sure fields are not too long
const trim = (str, max) => {
  return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};

module.exports = {
  name: "urban",
  args: true,
  description: "Query urban dictionary",
  arguments: "[search term]",
  execute: async (message, args) => {
    const query = querystring.stringify({ term: args.join(" ") });
    const list = await getUrbanDictionaryQuery(query);
    if (!list.length) {
      return message.channel.send(
        `No results found for **${args.join(" ")}**.`
      );
    }

    const [answer] = list;
    const embed = new MessageEmbed()
      .setColor("#e8e53e")
      .setTitle(answer.word)
      .addField("Definition", trim(answer.definition, 1024));

    if (answer.example) {
      embed.addField("Example", trim(answer.example, 1024));
    }

    message.channel.send(embed);
  },
  trim
};
