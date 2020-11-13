const axios = require("axios").default;
var xml2js = require("xml2js");

const getRedditPost = async (sub, top, limit) => {
  const redditUrl = `https://www.reddit.com/r/${sub}.json?limit=${limit}&sort=top&t=${top}`;
  try {
    const { data } = await axios.get(redditUrl);
    const redditData = data.data;
    const children = redditData.children;
    const len = redditData.dist - 1;
    const index = Math.floor(Math.random() * len + 1);
    if (children.length > 1) {
      const post = children[index]["data"];
      if (post.over_18) return "NSFW post";
      const msg = `${post["title"]}\n(r/${sub})\n${post["url"]}`;
      return msg;
    }
  } catch (err) {
    console.error(err);
  }
};

const getWeather = async (city, token) => {
  const openweatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}`;
  try {
    const { data } = await axios.get(openweatherUrl);
    return {
      country: data.sys.country,
      city: data.name,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      temp: (data.main.temp - 273.15).toFixed(2),
      wind: data.wind.speed,
      pressure: data.main.pressure,
      humidity: data.main.humidity
    };
  } catch (err) {
    console.error(err);
  }
};

const getCoronaStats = async (country) => {
  const coronaUrl = `https://api.covid19api.com/total/country/${country}`;
  try {
    const { data } = await axios.get(coronaUrl);
    const len = data.length;
    const latest = data[len - 1];
    const dayBefore = data[len - 2];
    const { Confirmed, Deaths, Recovered } = latest;
    return {
      ...latest,
      newCases: Confirmed - dayBefore.Confirmed,
      newDeaths: Deaths - dayBefore.Deaths,
      newRecovered: Recovered - dayBefore.Recovered
    };
  } catch (err) {
    console.error(err);
  }
};

const getUrbanDictionaryQuery = async (query) => {
  try {
    const { data } = await axios.get(
      `https://api.urbandictionary.com/v0/define?${query}`
    );
    return data.list;
  } catch (err) {
    console.error(err);
  }
};

const getMetarData = async (query) => {
  const url = `https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${query}&hoursBeforeNow=1`;
  try {
    const { data } = await axios.get(url);
    const { response } = await xml2js.parseStringPromise(data);
    return response;
  } catch (err) {
    console.error(err);
  }
};

// Adds spaces between thousands
const spaceNum = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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

module.exports = {
  getMetarData,
  getRedditPost,
  getWeather,
  getCoronaStats,
  getUrbanDictionaryQuery,
  spaceNum,
  getWn8Color
};
