const fs = require("fs");
const Discord = require("discord.js");
const { PREFIX, BOT_TOKEN } = require("./utils/config");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const helpCommand = {
  name: "help",
  description: "Help command",
  execute: (message, args) => {
    const commands = client.commands
      .keyArray()
      .map((name) => {
        const { arguments, description } = client.commands.get(name);
        return `${PREFIX}${name} ${
          arguments ? arguments : ""
        } - ${description}`;
      })
      .join("\n");

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(client.user.username)
      .addField("Description", "An annoying bot.")
      .addField("Commands", commands);

    message.channel.send(embed);
  }
};

client.commands.set(helpCommand.name, helpCommand);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
    if (message.author.username === "Maati") {
      message.react("💩");
    }
    return;
  }

  const args = message.content.slice(PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find((c) => c.aliases && c.aliases.includes(commandName));

  if (!command) {
    return message.channel.send(`Unknown command: ${commandName}.`);
  }

  if (command.args && !args.length) {
    return message.channel.send(
      `You didn't provide any arguments, ${message.author}!`
    );
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});

client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "general"
  );
  if (!channel) {
    console.error("Channel not found");
    return;
  }
  channel.send(`Welcome to the server, ${member}! :blush:\n 
  Use the ${PREFIX}help command to see everything I can do.`);
});

client.login(BOT_TOKEN);
