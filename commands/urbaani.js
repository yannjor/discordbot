const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");
const { trim } = require("./urban");

module.exports = {
  name: "urbaani",
  args: true,
  description: "Query urbaani sanakirja",
  arguments: "[search term]",
  execute: async (message, args) => {
    const searchTerm = args.join("-");
    try {
      const { data } = await axios.get(
        `https://urbaanisanakirja.com/word/${searchTerm}/`
      );

      const parseHtml = (text) => {
        return text
          .replace(/&quot;/g, "\"")
          .replace(/&#39;/g, "'")
          .replace(/<br \/>/g, "\n")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
      };

      const box = parseHtml(
        data.match(/<div class="box">(.*?)<div class="clearfix">/s)[0]
      );
      const title = box.match(/(?<=<h1>)(.*)(?=<\/h1>)/g)[0];
      const definition = box.match(/(?<=<p>)(.*)(?=<\/p>)/gs)[0];
      const quote = box.match(/(?<=<blockquote>)(.*)(?=<\/blockquote>)/gs);

      const embed = new MessageEmbed()
        .setColor("#ff00ff")
        .setTitle(title)
        .addField("Määritelmä:", trim(definition, 1024));

      if (quote) {
        embed.addField("Esimerkki:", trim(quote[0], 1024));
      }
      message.channel.send(embed);
    } catch (err) {
      message.channel.send(
        `Word not found in urbaani sanakirja: ${searchTerm}`
      );
    }
  }
};
