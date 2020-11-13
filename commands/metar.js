const { getMetarData } = require("../utils/common");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "metar",
  args: true,
  description: "Get metar data for a flight station.",
  arguments: "[station id]",
  execute: async (message, args) => {
    try {
      const { data } = await getMetarData(args[0]);
      const metar = data.map((d) => d.METAR);
      const latest = Object.fromEntries(
        Object.entries(metar[0][0]).map(([k, v]) => [k, v[0]])
      );
      const {
        raw_text,
        station_id,
        observation_time,
        temp_c,
        dewpoint_c,
        wind_dir_degrees,
        wind_speed_kt,
        visibility_statute_mi
      } = latest;

      const embed = new MessageEmbed()
        .setColor("0ea0a0")
        .setTitle(`METAR in ${station_id}`)
        .setDescription(
          `Raw: ${raw_text}
        Wind: ${wind_speed_kt} kt, from ${wind_dir_degrees}°
        Temp: ${temp_c}°C
        Dew point: ${dewpoint_c}°C
        Visibility: ${visibility_statute_mi} miles`
        )
        .setFooter(`Observed: ${new Date(observation_time)}`);

      message.channel.send(embed);
    } catch (err) {
      console.error(err);
      return message.channel.send(`Failed to fetch metar data for ${args[0]}`);
    }
  }
};
