module.exports = {
  name: "roll",
  args: false,
  aliases: ["r"],
  description: "Roll a number between 1 and a limit (default 100)",
  arguments: "[limit]",
  execute: (message, args) => {
    const num = Math.floor(Math.random() * (args[0] ? args[0] : 100) + 1);
    message.channel.send(num ? num : "Invalid argument");
    if (num === 69) message.channel.send("Nice");
  }
};
