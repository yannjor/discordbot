module.exports = {
  name: "rngroll",
  args: true,
  aliases: ["rr", "dr", "pr"],
  description: "Calculate min and max RNG rolls in WoT",
  arguments: "[average damage/penetration]",
  execute: (message, args) => {
    const average = Number(args[0]);
    message.channel.send(
      `Range: ${Math.floor(0.75 * average)} - ${Math.ceil(1.25 * average)}`
    );
  }
};
