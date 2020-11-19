const tabletojson = require("tabletojson").Tabletojson;

const getWn8Color = (wn8) => {
  if (wn8 < 300) return "#930d0d";
  else if (wn8 < 450) return "#cd3333";
  else if (wn8 < 650) return "#cc7a00";
  else if (wn8 < 900) return "#ccb800";
  else if (wn8 < 1200) return "#849b24";
  else if (wn8 < 1600) return "#4d7326";
  else if (wn8 < 2000) return "#4099bf";
  else if (wn8 < 2450) return "#3972c6";
  else if (wn8 < 2900) return "#793db6";
  else return "#401070";
};

const getWotLifeStats = async (player) => {
  const json = await tabletojson.convertUrl(
    `https://wot-life.com/eu/player/${player}`
  );
  return json;
};

module.exports = {
  getWn8Color,
  getWotLifeStats
};
